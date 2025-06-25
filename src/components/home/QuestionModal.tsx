import QuestionForm from '../../forms/QuestionForm'

type QuestionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; job_title?: string }) => void;
  isSubmitting?: boolean;
};

const QuestionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: QuestionModalProps) => {
  return (
    <QuestionForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
    />
  );
};

export default QuestionModal; 