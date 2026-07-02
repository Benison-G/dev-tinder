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

 - POST /request/review/accepted/:requestId
 - POST /request/review/ignored/:requestId

## userRouter
 - GET /user/connections
 - GET /user/requests
 - GET /user/feed

## Status values - ignore, interested, accepted, rejected