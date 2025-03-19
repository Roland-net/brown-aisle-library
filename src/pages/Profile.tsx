
import { motion } from 'framer-motion';
import UserProfile from '@/components/UserProfile';

const Profile = () => {
  return (
    <div className="pt-24 min-h-screen bg-cream-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <UserProfile />
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
