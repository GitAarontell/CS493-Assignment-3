const express = require('express');
const routerBoats = express.Router();
const boatfunc = require('./boat');
const slipfunc = require('./slip');



routerBoats.get('/', function (req, res) {
    const boats = boatfunc.get_boats()
        .then((boats) => {
            res.status(200).json(boats);
        });  
});

routerBoats.get('/:id', function (req, res) {
    boat_id = req.params.id;
    boatfunc.get_boat(boat_id)
        .then(boat => {
            if (boat[0] === undefined || boat[0] === null) {
                res.status(404).json({ 'Error': 'No boat with this boat_id exists' });
            } else {
                res.status(200).json(boat[0]);
            }
        });
});

routerBoats.post('/', function (req, res) {
    if (Object.keys(req.body).length == 3) {
        name = req.body.name;
        type = req.body.type;
        length = req.body.length;
        boatfunc.post_boat(name, type, length)
            .then(key => { 
                res.status(201).send({
                "id": key.id,
                "name": name,
                "type": type,
                "length": length}) 
            });
    } else {
        res.status(400).send({"Error": "The request object is missing at least one of the required attributes"});
    }
    
});

routerBoats.patch('/:id', function (req, res) {
    if (Object.keys(req.body).length == 3) {
        boatfunc.get_boat(req.params.id).then(boat => {
            if (boat[0] === undefined || boat[0] === null) {
                res.status(404).json({ 'Error': 'No boat with this boat_id exists' });
            } else {
                boatfunc.put_boat(req.params.id, req.body.name, req.body.type, req.body.length)
                    .then(res.status(200).send({
                        'id': req.params.id,
                        'name': req.body.name,
                        'type': req.body.type,
                        'length': req.body.length
                    })); 
            }
        });
               
    } else {

        res.status(400).send({"Error": "The request object is missing at least one of the required attributes"});
    }
    
});

routerBoats.delete('/:id', function (req, res) {
    boatfunc.get_boat(req.params.id).then(boat => {
        if (boat[0] === undefined || boat[0] === null) {
            res.status(404).json({ 'Error': 'No boat with this boat_id exists' });
        } else {
            // get all slips and check for boat id
            slipfunc.get_slips().then(slips => {
                for (let i = 0; i < slips.length; i++) {
                    if (slips[i].current_boat == req.params.id) {
                        let slipID = slips[i].id;
                        let num = slips[0].number;
                        // update slip so there is no boat in it
                        slipfunc.put_slip(slipID, num, null).then( () => {
                            // delete boat
                            boatfunc.delete_boat(req.params.id).then(
                                res.status(204).end());
                        });
                    }
                }
                // if this boat is not in a slip then delete
                boatfunc.delete_boat(req.params.id).then(
                    res.status(204).end());
            });
            
        }
    });
    
});

module.exports = routerBoats;