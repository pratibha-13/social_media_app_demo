const UserFollow = require("../model/userFollowModel");
const User = require("../model/userModel");
const ObjectId = require('mongodb');

const follow = async (req, res) => {
    try {
      let checkUserExists = await User.findOne({ _id : req.body.receiver_user_id })
      if(!checkUserExists)
      {
        return res.status(404).send({
          message: "Oops no record found with given ID",
        });
      }
      const authID = { sender_user_id: req.user._id };
      const receiver_user_id = { receiver_user_id: req.body.receiver_user_id };
      if (req.body.receiver_user_id == req.user._id)
      {
        return res.status(200).send({
          message: "You can not follow own.",
        });
      }
      let userFollow = await UserFollow.find()
      .where({
        $and: [receiver_user_id,authID]
        // Add more conditions to the $and array as needed
      })
      .then((async (userFollow) => {
        if (userFollow && userFollow.length > 0) {
          if (req.body.status == '0')
          {
            let result = await UserFollow.deleteOne({_id:userFollow[0]._id});
            if (result.deletedCount > 0) {
              return res.status(200).send({message: "Unfollow."});
            } else {
              return res.status(200).send({message: "UserFollow not found or not deleted."});
            }
          }
          else if (req.body.status == '3')
          {
            let userFollowID = userFollow[0]._id
            const result = await UserFollow.updateOne(
              { userFollowID },
              { $set: { status: '3' } }
            );
            return res.status(200).send({message: "Block."});
          }
          else
          {
            if (userFollow.status == '1')
            {
              return res.status(200).send({message: "Your following request is pending."});
            }else
            {
              return res.status(200).send({message: "You are already following."});
            }
          }
        } else {
        if(req.body.status == 1)
        {
          let newFollower = new UserFollow();
          newFollower.sender_user_id = req.user._id;
          newFollower.receiver_user_id = req.body.receiver_user_id;
          if (checkUserExists.who_can_follow_me == '0')
          {
            newFollower.status = '2';
            await newFollower.save();
            UserFollow.find({_id:newFollower._id})
            .populate('receiver_user_id')
            .then((result) => {
                res.status(200).json({
                  success: 1,
                  data: result,
                  msg: "Follow successfully.",
                });
            });
          }
          else if (checkUserExists.who_can_follow_me == '1')
          {
            newFollower.status = '1';
            await newFollower.save();
            console.log(newFollower._id)
            UserFollow.find({_id:newFollower._id})
            .populate('receiver_user_id')
            .then((result) => {
                res.status(200).json({
                  success: 1,
                  data: result,
                  msg: "Follow request send successfully.",
                });
            });
          }else
          {
            res.status(200).json({
              success: 1,
              data: newFollower,
              msg: "User profile is private. You can not follow.",
            });
          }
        }
        }
      }));
  } catch (error) {
      console.log(error)
      res.status(500).send(error);
  }
};

const followAction = async (req, res) => {
  try {
    let checkExits = await UserFollow.findOne({ _id : req.body._id })
    if(!checkExits)
    {
      return res.status(404).send({
        message: "Please enter valid id"
      });
    }
    const authID = { sender_user_id: req.user._id };
    const user_follow_id = { receiver_user_id: req.body._id };
    const status = { status: '2' };
    let userFollow = await UserFollow.find()
    .where({
      $and: [authID, user_follow_id,status]
      // Add more conditions to the $and array as needed
    })
    .then((async (userFollow) => {
      if( req.body.status == '0')
      {
        if (userFollow && userFollow.length > 0) {
          return res.status(200).send({message: "Request already accepted"});
        }else
        {
          if( checkExits.status == '1')
          {
            let sender_user = await User.find({_id : checkExits.sender_user_id});
            let receiver_user = await User.find({_id : checkExits.receiver_user_id});
          }
          await checkExits.deleteOne();
          return res.status(200).send({message: "Unfollow successfully"});
        }
      }else
      {
        if(req.body.status == '0')
        {
          if( checkExits.status == '1')
          {
            let sender_user = await User.find({_id : checkExits.sender_user_id});
            let receiver_user = await User.find({_id : checkExits.receiver_user_id});
          }
          await checkExits.deleteOne();
          return res.status(200).send({message: "Unfollow successfully"});
        }else
        {
          checkExits.status = req.body.status;
          await checkExits.save();
          UserFollow.find({_id:checkExits._id})
            .populate('receiver_user_id')
            .then((result) => {
                res.status(200).json({
                  success: 1,
                  data: result,
                  msg: "Follow successfully.",
                });
            });
        }
      }

    }));

} catch (error) {
    console.log(error)
    res.status(500).send(error);
}
};

const followersList = async (req, res) => {
  try {
    let page = req.body.page
    let pageSize = req.body.pageSize

    var search_options = {};
    search_options["$and"] = [];
    search_options["$and"].push({ 'status': '2' });
    search_options["$and"].push({ 'receiver_user_id': req.user._id });
    if(req.body.search) {
      search = req.body.search
      search_options["$and"].push({ 'user.userName': new RegExp(search, 'i') });
    }

    let aggrigationArray = [
      {
        $lookup: {
          from: 'users', // The name of the collection to join with
          localField: 'sender_user_id', // The field from the input documents
          foreignField: '_id', // The field from the documents of the "from" collection
          as: 'user' // The alias for the joined documents
        },
      },
      {
        "$match": search_options
      },
      {
        $skip: page - 1
      },
      {
        $limit: pageSize
      }
    ]
    const followersList = await UserFollow.aggregate(aggrigationArray);

    res.status(200).json({
      success: 1,
      data: followersList,
      msg: "Followers list.",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const followingList = async (req, res) => {
  try {
    let page = req.body.page
    let pageSize = req.body.pageSize

    var search_options = {};
    search_options["$and"] = [];
    search_options["$and"].push({ 'status': '2' });
    search_options["$and"].push({ 'sender_user_id': req.user._id });
    if(req.body.search) {
      search = req.body.search
      search_options["$and"].push({ 'user.userName': new RegExp(search, 'i') });
    }

    let aggrigationArray = [
      {
        $lookup: {
          from: 'users', // The name of the collection to join with
          localField: 'receiver_user_id', // The field from the input documents
          foreignField: '_id', // The field from the documents of the "from" collection
          as: 'user' // The alias for the joined documents
        },
      },
      {
        "$match": search_options
      },
      {
        $skip: page - 1
      },
      {
        $limit: pageSize
      }
    ]
    const followersList = await UserFollow.aggregate(aggrigationArray);

    res.status(200).json({
      success: 1,
      data: followersList,
      msg: "Following list.",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const requestedFollowList = async (req, res) => {
  try {
    let page = req.body.page
    let pageSize = req.body.pageSize

    var search_options = {};
    search_options["$and"] = [];
    search_options["$and"].push({ 'status': '1' });
    search_options["$and"].push({ 'receiver_user_id': req.user._id });
    if(req.body.search) {
      search = req.body.search
      search_options["$and"].push({ 'user.userName': new RegExp(search, 'i') });
    }

    let aggrigationArray = [
      {
        $lookup: {
          from: 'users', // The name of the collection to join with
          localField: 'sender_user_id', // The field from the input documents
          foreignField: '_id', // The field from the documents of the "from" collection
          as: 'user' // The alias for the joined documents
        },
      },
      {
        "$match": search_options
      },
      {
        $skip: page - 1
      },
      {
        $limit: pageSize
      }
    ]
    const followersList = await UserFollow.aggregate(aggrigationArray);

    res.status(200).json({
      success: 1,
      data: followersList,
      msg: "Requested Follow list.",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

const myBlockList = async (req, res) => {
  try {
    let page = req.body.page
    let pageSize = req.body.pageSize

    var search_options = {};
    search_options["$and"] = [];
    search_options["$and"].push({ 'status': '3' });
    search_options["$and"].push({ 'sender_user_id': req.user._id });
    if(req.body.search) {
      search = req.body.search
      search_options["$and"].push({ 'user.userName': new RegExp(search, 'i') });
    }

    let aggrigationArray = [
      {
        $lookup: {
          from: 'users', // The name of the collection to join with
          localField: 'receiver_user_id', // The field from the input documents
          foreignField: '_id', // The field from the documents of the "from" collection
          as: 'user' // The alias for the joined documents
        },
      },
      {
        "$match": search_options
      },
      {
        $skip: page - 1
      },
      {
        $limit: pageSize
      }
    ]
    const followersList = await UserFollow.aggregate(aggrigationArray);

    res.status(200).json({
      success: 1,
      data: followersList,
      msg: "Block list.",
    });
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

module.exports = {
  follow,
  followAction,
  followersList,
  followingList,
  requestedFollowList,
  myBlockList
};
