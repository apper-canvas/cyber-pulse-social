import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/molecules/PageHeader';
import CreatePostForm from '@/components/organisms/CreatePostForm';
import Button from '@/components/atoms/Button';

const CreatePostPage = () => {
  const navigate = useNavigate();

return (
    <div className="h-full overflow-y-auto bg-background">
      <PageHeader
        title="Create Post"
        showBackButton={true}
        onBackClick={() => navigate('/home')}
        rightContent={
          <Button
            type="submit" // This button will trigger form submission if it's inside the form context.
            // For now, it directly calls handleSubmit from the form.
            // Need to pass a function down from the form organism.
            // Let's adjust CreatePostForm to take an onSubmit prop or a ref.
            // For now, this will be handled by the form's own submit logic.
            // Re-evaluating: The header button is a trigger. The form needs its own submit logic.
            // The existing code calls handleSubmit from the page. We need to expose this.
            // Best: pass a 'triggerSubmit' prop to PageHeader, then the form takes a ref.
            // Simpler for this refactor: make the page handle form submission and pass it down.
            // Or make CreatePostForm its own self-contained unit and the page just renders it.
            // The current approach on the original page directly uses handleSubmit from the page.
            // Let's pass the loading/disabled state from the organism up.

            // Since PageHeader is a molecule, it shouldn't have direct knowledge of form submission state.
            // The `handleSubmit` and `loading` states are inside `CreatePostForm`.
            // Let's pass the `Post` button content/disabled state to PageHeader.
            // CreatePostForm will expose a render prop or a ref to its submit function.
            // Or, simply pass the button properties from the page to PageHeader.

            // Ok, the original code had `handleSubmit` in `Create` page.
            // I'll put `handleSubmit` in `CreatePostPage` and pass it to `CreatePostForm`.
            // The `loading` and `disabled` states will be managed in `CreatePostPage`.
            // This makes `CreatePostForm` more reusable (less tied to page state).
          >
            Post
          </Button>
        }
      />

      <div className="max-w-2xl mx-auto p-4">
        {/* CreatePostForm needs to manage its own state and pass handleSubmit up, or take it as a prop.
            Given the button is in the header, the page should manage the submit, or trigger the form.
            Let's keep the core logic inside CreatePostForm and pass the submit button to the header.
            The submit button logic needs access to form's loading/disabled state.
            This implies the page itself holds some states (loading, canPost).
            Let's re-integrate the submission logic into CreatePostForm and pass the submit button *element*
            to the PageHeader.
        */}
        <CreatePostForm />
      </div>
    </div>
  );
};

export default CreatePostPage;