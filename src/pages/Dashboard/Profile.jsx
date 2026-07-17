import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Camera, Save } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser, selectAuth, updateUser } from '../../features/auth/authSlice'
import toast from 'react-hot-toast'
import { commerceService } from '../../services/commerceApi'
import AvatarImage from '../../components/common/AvatarImage'

const schema = z.object({
  firstname: z.string().min(2, 'First name is required'),
  lastname: z.string().min(2, 'Last name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
})

const Profile = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const token = useSelector(selectAuth).token

  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
    firstname: user?.name?.split(' ')[0] || '',
    lastname: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || '',
    },
  })

  const onSubmit = async (data) => {
    try {
      dispatch(updateUser(await commerceService.updateProfile(token, data)))
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update profile')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">{t('dashboard.profile')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.personalInfo')}</p>
      </div>

      {/* Avatar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <AvatarImage
              src={user?.avatar}
              name={user?.name}
              alt={user?.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100 dark:ring-gray-800"
              fallbackClassName="w-20 h-20 rounded-2xl text-lg ring-4 ring-gray-100 dark:ring-gray-800"
            />
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center shadow-md hover:bg-brand-700 transition-colors">
              <Camera size={13} className="text-white" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-lg">
            {user?.name}
            </p>
            <p className="text-sm text-gray-400">@{user?.username}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-5">{t('dashboard.personalInfo')}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-base">{t('auth.register.firstName')}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input {...register('firstname')} className={`input-base pl-10 ${errors.firstname ? 'border-brand-400' : ''}`} />
              </div>
              {errors.firstname && <p className="mt-1 text-xs text-brand-600">{errors.firstname.message}</p>}
            </div>
            <div>
              <label className="label-base">{t('auth.register.lastName')}</label>
              <input {...register('lastname')} className={`input-base ${errors.lastname ? 'border-brand-400' : ''}`} />
              {errors.lastname && <p className="mt-1 text-xs text-brand-600">{errors.lastname.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-base">Username</label>
            <input {...register('username')} className={`input-base ${errors.username ? 'border-brand-400' : ''}`} />
            {errors.username && <p className="mt-1 text-xs text-brand-600">{errors.username.message}</p>}
          </div>

          <div>
            <label className="label-base">{t('auth.register.email')}</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('email')} type="email" className={`input-base pl-10 ${errors.email ? 'border-brand-400' : ''}`} />
            </div>
            {errors.email && <p className="mt-1 text-xs text-brand-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label-base">{t('checkout.phone')} <span className="text-gray-400 font-normal">({t('common.optional')})</span></label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input {...register('phone')} type="tel" placeholder="+1 (555) 000-0000" className="input-base pl-10" />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className="btn-brand btn-md gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? t('common.loading') : t('dashboard.saveChanges')}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default Profile
