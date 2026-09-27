import { Router } from 'express'
import healthRoutes from './healthRoutes.js'
import contactRoutes from './contactRoutes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/contact', contactRoutes)

export default router
