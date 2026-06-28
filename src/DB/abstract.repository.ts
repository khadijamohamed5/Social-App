import { Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose";

export abstract class AbstractRepository<T> {
    constructor(private _model: Model<T>) {}

    get model(){
        return this._model
    }

    public async create(item : Partial<T>){
        const doc = new this._model(item);
        return doc.save();
    }

    public async getOne(
        filter : QueryFilter<T>, // _id, email, price, userId
        projection? : ProjectionType<T>, // ageb ehh >> email / pass ? 
        options? : QueryOptions, // sort, skip, limit, populate
    ){
        return this._model.findOne(filter, projection, options);
    }


    public async getAll(
        filter : QueryFilter<T>, 
        projection? : ProjectionType<T>, 
        options? : QueryOptions, 
    ){
        return this._model.find(filter, projection, options);
    }

    public async updateOne(
        filter : QueryFilter<T>, 
        update : UpdateQuery<T>, 
        options : QueryOptions ={},  // default value
    ){
        return this._model.findOneAndUpdate(filter, update, options);
    }

    public async deleteOne(
        filter : QueryFilter<T>
    ){
        return this._model.deleteOne(filter)
    }
}

