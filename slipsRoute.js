const express = require('express');
const routerSlips = express.Router();
const slipfunc = require('./slip');
const boatfunc = require('./boat');



routerSlips.get('/', function (req, res) {
    const slips = slipfunc.get_slips()
        .then((slips) => {
            res.status(200).json(slips);
        });
});


routerSlips.get('/:id', function (req, res) {
    slip_id = req.params.id;
    slipfunc.get_slip(slip_id)
        .then(slip => {
            if (slip[0] === undefined || slip[0] === null) {
                res.status(404).json({ 'Error': 'No slip with this slip_id exists' });
            } else {
                res.status(200).json(slip[0]);
            }
        });
});

routerSlips.post('/', function (req, res) {
    if (Object.keys(req.body).length == 1) {
        num = req.body.number
        slipfunc.post_slip(num)
            .then(key => { 
                res.status(201).send({
                "id": key.id,
                "number": num,
                "current_boat": null
             });
            });
    } else {
        res.status(400).send({"Error": "The request object is missing the required number"});
    }
    
});
// also need to check if the boat is in storage a.k.a at a slip somewhere already
// also later need to make sure when you delete a boat it deletes it from the storage and slip possibly

routerSlips.put('/:id/:boat_id', function (req, res) {
    // check if slip exists
    slipfunc.get_slip(req.params.id).then(slip => {
        if (slip[0] === undefined || slip[0] === null) {
            res.status(404).json({ "Error": "The specified boat and/or slip does not exist" });
        } else {
            let num = slip[0].number;
            let slipCurBoat = slip[0].current_boat;
            // check if boat exists
            boatfunc.get_boat(req.params.boat_id).then(boat => {
                if (boat[0] === undefined || boat[0] === null) {
                    res.status(404).json({ "Error": "The specified boat and/or slip does not exist"  });
                } else {
                    // if slip is full then throws error
                    if (slipCurBoat != null){
                        res.status(403).send({"Error": "The slip is not empty"});
                    }
                    // updates slip to include boat
                    slipfunc.put_slip(req.params.id, num, req.params.boat_id).then( () => {
                        res.status(204).end();
                    }); 
                }
            });
        }
    }); 
});

routerSlips.delete('/:id/:boat_id', function (req, res) {
    slipfunc.get_slip(req.params.id).then(slip => {
        // check if slip exists
        if (slip[0] === undefined || slip[0] === null) {
            res.status(404).json({ "Error": "No boat with this boat_id is at the slip with this slip_id" });
        } else {
            let num = slip[0].number;
            let curBoat = slip[0].current_boat;
            // check if boat exists
            boatfunc.get_boat(req.params.boat_id).then(boat => {
                if (boat[0] === undefined || boat[0] === null) {
                    res.status(404).json({ "Error": "No boat with this boat_id is at the slip with this slip_id" });
                } else {
                    if (curBoat != req.params.boat_id) {
                        res.status(404).send({"Error": "No boat with this boat_id is at the slip with this slip_id"})
                    }
                    slipfunc.put_slip(req.params.id, num, null).then(
                        res.status(204).end()
                    );
                }
            });
        }
    });
    
});

routerSlips.delete('/:id', function (req, res) {
    slipfunc.get_slip(req.params.id).then(slip => {
        if (slip[0] === undefined || slip[0] === null) {
            res.status(404).json({ 'Error': 'No slip with this slip_id exists' });
        } else {
            slipfunc.delete_slip(req.params.id).then(
                res.status(204).end());
        }
    });
    
});

module.exports = routerSlips;