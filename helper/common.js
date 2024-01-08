var config = require('../config/config');
var nodemailer = require('nodemailer');
const moment = require("moment");
let UserSearchRequest = require("../models/userSearchRequest");
let ConstantContact = require("../models/constantContact");
var request = require('request');

var self = module.exports = {

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  },

  decodeBase64Image(dataString) {

    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    var response = {};
    if (matches != null) {
      if (matches.length !== 3) {
        return new Error('Invalid input string');
      }
    } else {
      return new Error('Invalid input string');
    }
    response.type = matches[1];
    response.data = new Buffer.from(matches[2], 'base64');
    return response;
  },



  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  sendEmail(subject, message, from, to) {
    let transporter = nodemailer.createTransport({
      host: config.mailHost,
      port: config.mailPort,
      secure: config.mailSecure,
      user: config.mailUser,
      auth: {
        user: config.mailUser,
        pass: config.mailPass
      }
    });

    let mailOptions = {
      from: '"Fork Freight  " <' + from + '>', // sender address
      to: to,
      subject: subject,
      html: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return error;
      }else{
        return info;
      }
    });

  },


  updateEmailData(html, data) {

    var rgx = /{{\w+\.\w+}}{1,}|{{\w+}}|{{\w+\.\w+\.\w+}}{1,}/g;
    let keys = [...html.matchAll(rgx)];
    //console.log(keys);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      key = key[0];
      html = html.replace(key, this.getValue(data, key));
    }
    return html;

  },

  getValue(data, key){
    key = key.replace('{{', '')
    key = key.replace('}}', '')
    key = key.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    key = key.replace(/^\./, '');           // strip a leading dot
    var a = key.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in data) {
        data = data[k];
      } else {
        return;
      }
    }
    return data;
  },


  generateSearchObject(search_object) {

    var search_options = {};
    search_options["$and"] = [];
    let isOpened = { "is_opened": true };
    search_options["$and"].push(isOpened);
  //  search_options["$and"].push({ distance: { $nin: [0] } });
    var currentDate = new Date();
    currentDate.setHours(-96, 0, 0);
    search_options["$and"].push({ ready_date: { $gte: currentDate } });

    if (search_object !== undefined) {

      let distanceRediuan = (search_object.radius) ? parseInt(search_object.radius) : 50;

      let pickupItems = {};
      pickupItems["$or"] = [];
      var originState = {};
      let cityState = {};
      cityState["$and"] = [];
      if (search_object.searchByState == false) {
        const latitude = parseFloat(search_object.current_latitude);
        const longitude = parseFloat(search_object.current_longitude);
        if (longitude && latitude) {
          let pickup_lat_long = {};
          pickup_lat_long["pickup_lat_long"] = { $geoWithin: { $centerSphere: [[Number(longitude), Number(latitude)], Number(distanceRediuan) / 3963.2] } }
          pickupItems["$or"].push(pickup_lat_long);
        }
      } else if (search_object.searchByState && search_object.pickup_states) {
        originState["pickup_states"] = { $in: search_object.pickup_states };
        cityState["$and"].push(originState);
        pickupItems["$or"].push(cityState);
        // search_options["$and"].push({ 'pickup_states': { $in: [search_object.pickup_states] } });
      } else {
        // search_options["$and"].push({ 'pickup_states': { $in: ["00"] } });
      }
      if (pickupItems["$or"].length > 0) { search_options["$and"].push(pickupItems); }


      let deliveryItems = {};
      deliveryItems["$or"] = [];
      var originState = {};
      let dcityState = {};
      dcityState["$and"] = [];
      if (search_object.searchByState == false) {
        const dlatitude = parseFloat(search_object.delivery_latitude);
        const dlongitude = parseFloat(search_object.delivery_longitude);
        if (dlatitude && dlongitude) {
          let delivery_lat_long = {};
          delivery_lat_long["delivery_lat_long"] = { $geoWithin: { $centerSphere: [[Number(dlongitude), Number(dlatitude)], Number(distanceRediuan) / 3963.2] } }
          deliveryItems["$or"].push(delivery_lat_long);
        }
      } else if (search_object.searchByState && search_object.delivery_states) {
        originState["delivery_states"] = { $in: search_object.delivery_states };
        dcityState["$and"].push(originState);
        deliveryItems["$or"].push(dcityState);
        // search_options["$and"].push({ 'delivery_states': { $in: [search_object.delivery_states] } });
      } else {
        // search_options["$and"].push({ 'delivery_states': { $in: ["00"] } });
      }
      if (deliveryItems["$or"].length > 0) {
        search_options["$and"].push(deliveryItems);
      }

      if (search_object.ready_date != null && search_object.end_date != null) {
        let st_dt = search_object.ready_date.split(',')[0];
        let tim = "00:00";
        let s_datetime = moment.utc(st_dt + ' ' + tim);
        let ready_date = new Date(s_datetime);
        ready_date.setUTCHours(10, 10, 10);
        //for end date
        let _end_date = search_object.end_date.split(',')[0];
        let _time = "23:00";
        let end_datetime = moment.utc(_end_date + ' ' + _time);
        let end_date = new Date(end_datetime);
        end_date.setUTCHours(23, 59, 59);
        search_options["$and"].push({ ready_date: { $gte: ready_date, $lte: end_date } });
      } else if (search_object.ready_date != null && search_object.ready_date != "" && search_object.end_date == null) {
        let st_dt = search_object.ready_date.split(',')[0];
        let tim = "00:00";
        let s_datetime = moment.utc(st_dt + ' ' + tim);
        let ready_date = new Date(s_datetime);
        ready_date.setUTCHours(10, 10, 10);
        search_options["$and"].push({ ready_date: { $gte: ready_date } });
      } else if (search_object.end_date != null && search_object.ready_date == null) {
        //for end date
        let _end_date = search_object.end_date.split(',')[0];
        let _time = "23:00";
        let end_datetime = moment.utc(_end_date + ' ' + _time);
        let end_date = new Date(end_datetime);
        end_date.setUTCHours(23, 59, 59);
        search_options["$and"].push({ ready_date: { $lte: end_date } });
      }

      //Equipment type, Load weight and Load length
      if (search_object.equipment_type) {
        var equipmentOption_array = search_object.equipment_type.split(',');
        var equipmentOption = [];
        for (const i of equipmentOption_array) {
          //equipmentOption.push(new RegExp(`${i}`));
          equipmentOption.push(new RegExp("^" + i.toLowerCase(), "i"));
        }
        search_options["$and"].push({ 'equipment_type': { $in: equipmentOption } });
      }

      if (search_object.load_weight && search_object.load_weight != '') {
        let load_weight = {};
        load_weight["load_weight"] = { $lte: Number(search_object.load_weight) };
        search_options["$and"].push(load_weight);
      }

      if (search_object.load_length && search_object.load_length != '') {
        let load_length = {};
        load_length["load_length"] = { $gte: Number(search_object.load_length) };
        search_options["$and"].push(load_length);
      }

      // if (search_object.load_length && search_object.load_length != '') {
      //   let load_length = {};
      //   if (search_object.load_length == 1) {
      //     load_length["load_length"] = { $gte: 40 };
      //   } else if (search_object.load_length == 2) {
      //     load_length["load_length"] = { $lte: 40 };
      //   }
      //   search_options["$and"].push(load_length);
      // }
    }

    return search_options;
  },

  addUserSearchRequest(param, type, total_record, user_id) {
    if (param && type && total_record && user_id) {
      searchList = new UserSearchRequest();
      searchList.searchParams = param;
      searchList.user_id = user_id;
      searchList.type = type;
      searchList.total_record = total_record;
      searchList.created_at = Date.now();
      searchList.save();
      return '';
    }else{
      return '';
    }
  },
  async getUserSearchObject(search_object, isPostEveryWhere = false, is_internal = false, freeSubscriptionId = [],publicRoles = []) {
    var search_options = {};
    search_options["$and"] = []
    if(!is_internal){
      search_options['$and'].push({ $or: [{ "is_internal": is_internal }, { "is_internal": null }] })
      if(publicRoles.length){
        search_options['$and'].push({role:{$in:publicRoles} })
      }
    }else{
      search_options['$and'].push({ $or: [{ "is_internal": is_internal }, { "role": {$in:publicRoles} }] })
    }
    if (isPostEveryWhere) {
      search_options["$and"].push(
        { "source_data": { $eq: "posteverywhere" } }
      );
    } else {
      search_options["$and"].push(
        { "source_data": { $ne: "posteverywhere" } }
      );
    }
    /** now we r not using regex anymore as we implement source_data for user filter */
    // else {
    //   search_options["$and"].push(
    //     { $or: this.posteveryWhereRegxForNot }
    //   );
    // }

    function addInsearch(val) {
      if (!search_options["$and"]) search_options["$and"] = []
      search_options["$and"].push(val);
    }

    if (search_object.status && (search_object.status === 'active' || search_object.status === 'inactive')) {
      // let status_option = {}
      // status_option["status"] = search_object.status;
      // addInsearch(status_option);
      /**
      * for activeUsers filter
      * subscription must be true and
      * source_data should not posteverywhere and
      * status should be active
      */
      let today = new Date();
      today.setHours(0, 0, 0);
      if (search_object.status === 'active') {
        search_options['$and'].push({
          status: "active",
          // $or:[
          //     {"subscription_package":{$in:freeSubscriptionId}},
          //     {"subscription_expire_on": { $gte: today }}
          // ],
          //"payment_status": {$nin:["past_due"]}          // {}
        });

      } else if (search_object.status === 'inactive') {
        //filter user with status "inactive and subcription=false or expiry less than today"
        search_options['$and'].push({
          $or: [
            // {subscription:false},
            // {$and:
            // [
            // {"subscription_package":{$nin:freeSubscriptionId}},
            // { subscription_expire_on: { $lt: today } }
            //  ]},
           // { "payment_status": { $in: ["past_due"] } },
            { status: "inactive" },
            // {"subscription_package.is_free":false}
          ],
        })
      }
    }

    if (search_object.role && search_object.role !== '') {
      let role_option = {}
      // if(typeof search_object.role == "string"){
      role_option["role"] = search_object.role;
      // }else{
      //   role_option["role"] = { $in : search_object.roles};
      // }
      addInsearch(role_option);
    }
    if (search_object.first_name && search_object.first_name !== '') {
      let option = {}
      option["first_name"] = { $regex: '.*' + search_object.first_name + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.username && search_object.username !== '') {
      let option = {}
      option["username"] = { $regex: '.*' + search_object.username + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.last_name && search_object.last_name !== '') {
      let option = {}
      option["last_name"] = { $regex: '.*' + search_object.last_name + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.email && search_object.email !== '') {
      let option = {}
      option["email"] = { $regex: '.*' + search_object.email + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.company && search_object.company !== '') {
      let option = {}
      option["company"] = { $regex: '.*' + search_object.company + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.phone && search_object.phone !== '') {
      let option = {}
      option["phone"] = { $regex: '.*' + search_object.phone + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.mc_Number && search_object.mc_Number !== '') {
      let option = {}
      option["mc_Number"] = { $regex: '.*' + search_object.mc_Number + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.businessType && search_object.businessType !== '') {
      let option = {}
      option["businessType"] = { $regex: '.*' + search_object.businessType + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.subscription_type && search_object.subscription_type !== '') {
      let option = {}
      option["subscription_type"] = { $regex: '.*' + search_object.subscription_type + '.*', $options: 'i' };
      addInsearch(option);
    }
    if (search_object.payment_status) {
      let option = {}
      option["payment_status"] = search_object.payment_status;
      addInsearch(option);
    }
    if (search_object.payment_status) {
      let option = {}
      option["payment_status"] = search_object.payment_status;
      addInsearch(option);
    }

    return search_options;
  },
  vicidialRegister(user, callback) {

    try {
      if (config.portalUrl == 'https://app.forkfreight.com') {
        if (user.phone && user.role && user.first_name && user.last_name) {
          var role = "";
          if (user.role == "carrier") {
            role = config.VicidialCarrier;
          }
          else if (user.role == "broker") {
            role = config.VicidialBroker;
          }
          else if (user.role == "dispatcher") {
            role = config.VicidialDispatcher;
          }
          else if (user.role == "shipper") {
            role = config.VicidialShipper;
          }
          else if (user.role == "CDLdriver") {
            role = config.VicidialCDLdriver;
          }
          if (role) {
            let url = config.VicidialUrl + '?source=test&user=' + config.VicidialAdminUserName + '&pass=' + config.VicidialAdminPassword + '&function=add_lead&phone_number=' + user.phone + '&phone_code=1&list_id=' + role + '&first_name=' + user.first_name + '&last_name=' + user.last_name + '&email=' + user.email + '&title=' + user.role;
            let options = {
              method: 'get',
              json: true,
              url: url
            }
            request(options, function (err, rest, body) {
              if (err) {
                return 0;
                //callback(0);
              } else {
                return 1;
                //callback(1);
              }
            })
          } else {
            return 0;
            //callback(0);
          }
        } else {
          return 0;
          //callback(0);
        }
      }else{
        return 0;
      }
    } catch (error) {
      return 0;
      //callback(0);
    }
  },

  constantContact(user, callback) {

    try {
      if (config.portalUrl == 'https://app.forkfreight.com') {
        if (user.email) {

          ConstantContact.findOne().exec(function (err, token) {
            var obj = {
              "first_name": (user.first_name) ? user.first_name:'',
              "last_name": (user.last_name) ? user.last_name:'',
              "email_address": user.email,
              "company_name": "",
              "phone_number": (user.phone) ? user.phone:'',
              "street_address": {
                "kind": "home",
                "street": (user.address) ? user.address: ""
              },
              "create_source": "Account",
              "list_memberships": ["27e168fe-3b38-11ed-a4f1-fa163e8d7f7f"]
            }
            if (user.company_id && user.company_id.company_name) {
              obj.company_name = user.company_id.company_name
            }
            console.log(obj)
            var options = {
              'method': 'POST',
              'url': 'https://api.cc.email/v3/contacts/sign_up_form',
              'headers': {
                'Authorization': 'Bearer ' + token.access_token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(obj)
            };

            request(options, function (error, response, body) {
              if (error) {
                console.log(error)
                return 0;
              } else {
                console.log(response)
                console.log(body)
                return 1;
              }
            });
          });

        } else {
          return 0;
          //callback(0);
        }
      }else{
        return 0;
      }
    } catch (error) {
      return 0;
      //callback(0);
    }
  }


}
