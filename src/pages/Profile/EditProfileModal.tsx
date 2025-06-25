import EditProfileForm from '../../forms/EditProfileForm'

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onProfileUpdated: (newUser: any) => void;
}

const EditProfileModal = ({ isOpen, onClose, user, onProfileUpdated }: EditProfileModalProps) => {
  return (
    <EditProfileForm
      isOpen={isOpen}
      onClose={onClose}
      user={user}
      onProfileUpdated={onProfileUpdated}
    />
  );
};

export default EditProfileModal; 