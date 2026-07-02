## authRouter
 - POST /signup
 - POST /login
 - POST /logout

## profileRouter
 - GET /profile/view
 - PATCH /profile/update
 - PATCH /profile/password

## connectionRouter
 - POST /request/send/:status/:userId
 - POST /request/review/:status/:requestId

## userRouter
 - GET /user/connections
 - GET /user/requests
 - GET /user/feed

## Status values - ignored, interested, accepted, rejected