import { useState, FormEvent } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";


interface UserMetadata {
  fullName: string;
}

interface User {
  email: string;
  user_metadata: UserMetadata;
}


function UpdateUserDataForm() {
  const { user, isLoading: isUserLoading } = useUser();

  if (isUserLoading) return <p>Loading user data...</p>;
  if (!user) return <p>No user found</p>;

  const { updateUser, isUpdating } = useUpdateUser();

  const [fullName, setFullName] = useState<string>(user.user_metadata.fullName);
  const [avatar, setAvatar] = useState<File|null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;
    const form = e.currentTarget;
    updateUser(
      {avatar,fullName},
      {
        onSuccess: () => {
          setAvatar(null);
          form.reset();
        },
      }
    );
  }

  function handleCancel() {
    if(user)
    {
    setFullName(user.user_metadata.fullName);
    }
    setAvatar(null);
  }
  
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null; 
    setAvatar(file);
  }


  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={user.email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
