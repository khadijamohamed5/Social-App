import { Schema, model } from "mongoose";
import { IComment } from "../../../common";

const schema = new Schema<IComment>(
    {
        userId : {type: Schema.Types.ObjectId, ref: "User", required: true},
        postId :{type: Schema.Types.ObjectId, ref: "Post", required: true},
        parentId :{type: Schema.Types.ObjectId, ref: "Comment"},
        mentions : [{ type: Schema.Types.ObjectId, ref: "User"}],

        content : String,
        attachment : String,
        reactionsCount: {type : Number, default :0},

    }, 
    { timestamps : true}
)

// mongoose middleware 
schema.pre("deleteOne",async function(){ // by default Query type so make {document : true}

    let filter = this.getFilter(); // {_id:parentId}

    // find all replies 
    const replies = await this.model.find({ parentId : filter._id})  // [{},{},{}] | []

    // if replies >> loop to delete it 
    if(replies.length > 0 ) {   // recursive delete
        for ( const reply of replies){
            await this.model.deleteOne({ _id : reply._id })
        }
    }
})




export const Comment = model("Comment", schema)