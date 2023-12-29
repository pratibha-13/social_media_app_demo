const { check, validationResult } = require('express-validator');

const signupValidators = () => [
  //check('email', 'Email length should be 10 to 30 characters').isEmail(),
  check('fullName', 'Fullname is required').notEmpty(),
  check('userName', 'username id is required').notEmpty(),
  check('email', 'Email is required').notEmpty(),
]

const signinValidators = () => [
  check('email', 'Please enter correct email').isEmail(),
  check('password', 'Password is required').notEmpty()
]

const loginValidators = () => [
  check('email', 'Please enter correct email').isEmail(),
  check('password', 'Password is required').notEmpty()
]

const forgotPasswordValidators = () => [
  check('email', 'Please enter correct email').isEmail()
]

const verifyResetTokenValidators = () => [
  check('reset_token', 'Reset token is required').notEmpty()
]

const changePasswordValidators = () => [
  check('reset_token', 'Reset token is required').notEmpty(),
 // check('password', 'Password length should be minimun 8 and maximum 16 characters').isLength({ min: 8, max: 16 }),
  check('password', 'Password is required').notEmpty()
]

const changePasswordProfileValidators = () => [
 // check('password', 'Password length should be minimun 8 and maximum 16 characters').isLength({ min: 8, max: 16 }),
  check('password', 'Password is required').notEmpty(),
  check('current_password', 'Current Password is required').notEmpty()
]

const updateProfileValidators = () => [
  check('first_name', 'First name is required').notEmpty(),
  check('last_name', 'Last name is required').notEmpty(),
 // check('address', 'Address is required').notEmpty(),
  //check('company', 'Company is required').notEmpty()
]

const socialloginValidators = () => [
  check('social_type', 'Social type is required').notEmpty(),
  check('social_provider_id', 'Social provider id is required').notEmpty()
]

const checkEmailExistValidators = () => [
  check('email', 'Email is required').notEmpty()
]

const checkSocialProviderExistValidators = () => [
  check('social_provider_id', 'Social provider id is required').notEmpty()
]

const getUserByIdValidators = () => [
  check('user_id', 'User Id is required').notEmpty()
]

const truckDetailValidators = () => [
  check('truck_id', 'Truck Id is required').notEmpty()
]

const updateTokenValidators = () => [
  check('device_token', 'Device Token is required').notEmpty(),
  check('device_type', 'Device Type is required').notEmpty()
]

const brokerDetailValidators = () => [
  check('broker_id', 'Broker Id is required').notEmpty()
]

const CDLValidators = () => [
  check('cdl_document_front', 'CDL document is required').notEmpty()
]

const addLoadValidators = () => [
  check('pickup_addresses', 'Pickup Address is required').notEmpty(),
  check('pickup_latitude', 'Pickup latitude is required').notEmpty(),
  check('pickup_longitude', 'Pickup longitude is required').notEmpty(),
  check('delivery_addresses', 'Delivery Address is required').notEmpty(),
  check('delivery_latitude', 'Delivery latitude is required').notEmpty(),
  check('delivery_longitude', 'Delivery longitude is required').notEmpty(),
  check('pickup_date', 'Pickup date is required').notEmpty(),
  check('delivery_date', 'Delivery date is required').notEmpty(),
  // check('line_haul', 'Line Haul is required').notEmpty(),
  //check('commodity', 'Commodity is required').notEmpty(),
  // check('pallets_number', 'Pallets number is required').notEmpty(),
  check('equipment_type', 'Equipment type is required').notEmpty(),
  check('load_type', 'Load type is required').notEmpty(),
  check('load_weight', 'Load weight is required').notEmpty(),
  check('contact_phone_number', 'Phone number is required').notEmpty(),
  //check('price', 'Price is required').notEmpty(),
  // check('contact_email', 'Email is required').notEmpty(),
]

const updateLoadValidators = () => [
  check('load_id', 'Load Id is required').notEmpty(),
  check('pickup_addresses', 'Pickup Address is required').notEmpty(),
  check('pickup_latitude', 'Pickup latitude is required').notEmpty(),
  check('pickup_longitude', 'Pickup longitude is required').notEmpty(),
  check('delivery_addresses', 'Delivery Address is required').notEmpty(),
  check('delivery_latitude', 'Delivery latitude is required').notEmpty(),
  check('delivery_longitude', 'Delivery longitude is required').notEmpty(),
  check('pickup_date', 'Pickup date is required').notEmpty(),
  check('delivery_date', 'Delivery date is required').notEmpty(),
  // check('line_haul', 'Line Haul is required').notEmpty(),
 // check('commodity', 'Commodity is required').notEmpty(),
  // check('pallets_number', 'Pallets number is required').notEmpty(),
  check('equipment_type', 'Equipment type is required').notEmpty(),
  check('load_type', 'Load type is required').notEmpty(),
  check('load_weight', 'Load weight is required').notEmpty(),
  check('contact_phone_number', 'Phone number is required').notEmpty(),
  //check('price', 'Price is required').notEmpty(),
  // check('contact_email', 'Email is required').notEmpty(),
]

const loadDetailValidators = () => [
  check('load_id', 'Load Id is required').notEmpty()
]

const loadStatusChangeValidators = () => [
  check('load_id', 'Load Id is required').notEmpty(),
  check('is_opened', 'Is opened is required').notEmpty()
]

const truckStatusChangeValidators = () => [
  check('truck_id', 'Truck Id is required').notEmpty(),
  check('is_opened', 'Is opened is required').notEmpty()
]

const addTruckValidators = () => [
  check('contact_phone_number', 'Phone number is required').notEmpty(),
  check('contact_email', 'Email is required').notEmpty(),
]

const updateTruckValidators = () => [
  check('truck_id', 'Truck Id is required').notEmpty()
]

const loadAddToWatchlistValidators = () => [
  check('load_id', 'Load Id is required').notEmpty()
]

const postBidValidators = () => [
  check('load_id', 'Load Id is required').notEmpty()
]

const postTruckBidValidators = () => [
  check('truck_id', 'Truck Id is required').notEmpty()
]

// const findBidListValidators = () => [
//   check('load_id', 'Load Id is required').notEmpty()
// ]

const acceptBidValidators = () => [
  check('bid_user_id', 'bid user id is required').notEmpty(),
  check('load_id', 'Load Id is required').notEmpty()
]

const acceptTruckBidValidators = () => [
  //check('bid_user_id', 'bid user id is required').notEmpty(),
  check('truck_id', 'Truck Id is required').notEmpty()
]

const dispatcherLoadValidators = () => [
  check('user_id', 'User id is required').notEmpty()
]

const postJobValidators = () => [
  check('title', 'title is required').notEmpty()
]

const applyJobValidators = () => [
  check('job_id', 'job id is required').notEmpty()
]

const jobDetailValidators = () => [
  check('job_id', 'job id is required').notEmpty()
]

const acceptedJobValidators = () => [
  check('job_user_id', 'job_user_id is required').notEmpty(),
  check('job_id', 'job_id is required').notEmpty()
]

const contactusValidators = () => [
  check('email', 'Email is required').notEmpty()
]

const getPackagesSignUpAndProfilePackageValidators = () => [
  check('role', 'Role is required').notEmpty()
]

const validateEmailValidators = () => [
  check('email', 'Email is required').notEmpty()
]



const reporter = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.json({ success: 0, data: {}, msg: errorMessages[0] });
  }
  next();
}

module.exports = {
  signup: [
    signupValidators(),
    reporter
  ],
  signin: [
    signinValidators(),
    reporter
  ],
  login: [
    loginValidators(),
    reporter
  ],
  checkEmailExist:[
    checkEmailExistValidators(),
    reporter
  ],
  checkSocialProviderExist: [
    checkSocialProviderExistValidators(),
    reporter
  ],
  updateProfile: [
    updateProfileValidators(),
    reporter
  ],
  forgotPassword: [
    forgotPasswordValidators(),
    reporter
  ],
  verifyResetToken: [
    verifyResetTokenValidators(),
    reporter
  ],
  changePassword: [
    changePasswordValidators(),
    reporter
  ],
  changePasswordProfile: [
    changePasswordProfileValidators(),
    reporter
  ],
  sociallogin: [
    socialloginValidators(),
    reporter
  ],
  getUserDetailById: [
    getUserByIdValidators(),
    reporter
  ],
  truckDetail: [
    truckDetailValidators(),
    reporter
  ],
  updateToken: [
    updateTokenValidators(),
    reporter
  ],
  brokerDetail: [
    brokerDetailValidators(),
    reporter
  ],
  CDL: [
    CDLValidators(),
    reporter
  ],
  addLoad: [
    addLoadValidators(),
    reporter
  ],
  loadDetail: [
    loadDetailValidators(),
    reporter
  ],
  loadStatusChange: [
    loadStatusChangeValidators(),
    reporter
  ],
  truckStatusChange: [
    truckStatusChangeValidators(),
    reporter
  ],
  updateLoad: [
    updateLoadValidators(),
    reporter
  ],
  addTruck: [
    addTruckValidators(),
    reporter
  ],
  updateTruck: [
    updateTruckValidators(),
    reporter
  ],
  loadAddToWatchlist: [
    loadAddToWatchlistValidators(),
    reporter
  ],
  postBid: [
    postBidValidators(),
    reporter
  ],
  postTruckBid: [
    postTruckBidValidators(),
    reporter
  ],
  dispatcherLoad: [
    dispatcherLoadValidators(),
    reporter
  ],
  // findBidList: [
  //   findBidListValidators(),
  //   reporter
  // ],
  acceptBid: [
    acceptBidValidators(),
    reporter
  ],
  acceptTruckBid: [
    acceptTruckBidValidators(),
    reporter
  ],
  contactus: [
    contactusValidators(),
    reporter
  ],
  postJob: [
    postJobValidators(),
    reporter
  ],
  applyJob: [
    applyJobValidators(),
    reporter
  ],
  jobDetail: [
    jobDetailValidators(),
    reporter
  ],
  acceptedJob: [
    acceptedJobValidators(),
    reporter
  ],
  getPackagesSignUpAndProfilePackage: [
    getPackagesSignUpAndProfilePackageValidators(),
    reporter
  ],
  validateEmail: [
    validateEmailValidators(),
    reporter
  ],
};
