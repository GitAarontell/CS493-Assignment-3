const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({projectId: 'hw3-bertella'});
const SLIP = "Slip";

function get_slips() {
    const q = datastore.createQuery(SLIP);
    return datastore.runQuery(q).then((entities) => {
        return entities[0].map(fromDatastore);
    });
}

function get_slip(id) {
    const key = datastore.key([SLIP, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            return entity;
        } else {
            return entity.map(fromDatastore);
        }
    });
}

function post_slip(num) {
    var key = datastore.key(SLIP);
    const new_slip = {"number": num, "current_boat": null};
    return datastore.save({ "key": key, "data": new_slip }).then(() => { return key });
}


function put_slip(id, num, current_boat) {
    const key = datastore.key([SLIP, parseInt(id, 10)]);
    const slip = { "number": num, "current_boat": current_boat};
    return datastore.save({ "key": key, "data": slip });
}

function delete_slip(id) {
    const key = datastore.key([SLIP, parseInt(id, 10)]);
    return datastore.delete(key);
}

function fromDatastore(item) {
    item.id = item[Datastore.KEY].id;
    return item;
}



module.exports = {get_slips, get_slip, post_slip, put_slip, delete_slip}