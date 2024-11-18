import React from "react";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FileInput from "../../ui/FileInput";
import { useForm,  SubmitHandler } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreatecabin } from "./useCreatecabin";
import { useEditcabin } from "./useEditcabin";
import { Cabin } from "../../types";



interface CreateCabinFormProps {
  cabintoEdit?: Cabin;
  onCloseModal?: () => void;
}

const CreateCabinForm: React.FC<CreateCabinFormProps> = ({
  cabintoEdit = {},
  onCloseModal,
}) => {
  const { id: editId, ...editValues } = cabintoEdit||{};
  const isEditing = Boolean(editId);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Cabin>({
    defaultValues: isEditing ? editValues : {},
  });

  const { mutate } = useCreatecabin();
  const { editCabin } = useEditcabin();

  const onSubmit: SubmitHandler<Cabin> = (data) => {
    const image = typeof data.image === "string" ? data.image : data.image?.[0];

    if (isEditing) {
      editCabin(
        { newCabinData: { ...data, image }, id: editId! },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      mutate(
        { data },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "Mandatory to fill" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCap?.message}>
        <Input
          type="number"
          id="maxCap"
          {...register("maxCap", {
            required: "This field is mandatory!",
            min: {
              value: 1,
              message: "Capacity should be at least greater than 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          {...register("regularPrice", {
            required: "This field is mandatory!",
            min: {
              value: 1,
              message: "Price should be at least greater than 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register("discount", {
            required: "This field is mandatory!",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Regular price must be greater than the discount",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          {...register("description", {
            required: "This field is mandatory!",
          })}
          defaultValue=""
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          type="file"
          {...register("image", {
            required: isEditing ? false : "This field is mandatory!",
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>{isEditing ? "Edit Cabin" : "Add Cabin"}</Button>
      </FormRow>
    </Form>
  );
};

export default CreateCabinForm;
