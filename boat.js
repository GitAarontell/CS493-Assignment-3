const { Datastore } = require('@google-cloud/datastore');
const datastore = new Datastore({projectId: 'hw3-bertella'});
const BOAT = "Boat";

function get_boats() {
    const q = datastore.createQuery(BOAT);
    return datastore.runQuery(q).then((entities) => {
        console.log(entities);
        return entities[0].map(fromDatastore);
    });
}

function get_boat(id) {
    const key = datastore.key([BOAT, parseInt(id, 10)]);
    return datastore.get(key).then((entity) => {
        if (entity[0] === undefined || entity[0] === null) {
            return entity;
        } else {
            return entity.map(fromDatastore);
        }
    });
}

function post_boat(name, type, length) {
    var key = datastore.key(BOAT);
    const new_boat = {"name": name, "type": type, "length": length};
    return datastore.save({ "key": key, "data": new_boat }).then(() => { return key });
}

function put_boat(id, name, type, length) {
    const key = datastore.key([BOAT, parseInt(id, 10)]);
    const boat = { "name": name, "type": type, "length": length };
    return datastore.save({ "key": key, "data": boat });
}

function delete_boat(id) {
    const key = datastore.key([BOAT, parseInt(id, 10)]);
    return datastore.delete(key);
}

function fromDatastore(item) {
    item.id = item[Datastore.KEY].id;
    return item;
}

module.exports = {get_boats, get_boat, post_boat, put_boat, delete_boat}