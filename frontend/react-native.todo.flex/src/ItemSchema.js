export class Item {
  constructor({
    _id = new BSON.ObjectId(),
    activity = true,
    activity_type = '', // update this line to have a default value of ''
    date = new Date(),
    time = new Date(),
    owner_id,
  }) {
    this._id = _id;
    this.activity = activity;
    this.activity_type = activity_type;
    this.date = date;
    this.time = time;
    this.owner_id = owner_id;
  }

  static schema = {
    name: 'Item',
    properties: {
      _id: 'objectId',
      activity: {type: 'bool', default: true},
      activity_type: {type: 'string'}, // update this line to have a default value of ''
      date: {type: 'date', default: new Date()},
      time: {
        type: 'date',
        default: new Date(),
      },
      owner_id: 'string',
    },
    primaryKey: '_id',
  };
}
