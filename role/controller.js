const Role = require('../model/roleModel')

const newRole = async (req, res) => {
    try {
        let newRole = new Role({
            name: req.body.name,
            description: req.body.description,
            permission_template: req.body.permission_template,
        });
        let role = await newRole.save()
            if (!role) {
                return res.json({success: false, msg: 'Save role failed.'});
            }
            res.json({success: true, msg: 'Successful created new Role.'});
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

const updateRole = async (req, res) => {
    // console.log(req);
    try {
        var role_id = req.body.role_id
        const update = {
            "$set": {
                "description": req.body.description,
                "name": req.body.name,
                "permission_template": req.body.permission_template,
            }
        };
        let roleResult = Role.findByIdAndUpdate(role_id, update, {new: true}).exec();
        // Role.findOneAndUpdate({ _id: role_id }, update, { upsert: true }, function (err, roleResult) {
        //     if (err) {
        //         return res.json({ success: 0, data: {}, msg: err });
        //     } else {
                return res.json({ success: 1, msg: 'Role updated successfully.' });
            // }
        // });
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
}

const getRole = async (req, res) => {
    try {
        let rolesData = await Role.find({});
        return res.json({ success: 1, msg: 'Role list.', data: { role: rolesData}  });
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

module.exports = {
    newRole,
    updateRole,
    getRole
}