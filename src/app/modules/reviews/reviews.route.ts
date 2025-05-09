import express from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { reviewController } from './reviews.controller'

const router = express.Router()

router.post("/create", auth(UserRole.USER), reviewController.createReview)
router.get("/service/:id", reviewController.getServiceReviews)
router.get("/all",auth(UserRole.ADMIN), reviewController.getAllReviews)

export const reviewRoutes = router