import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import FileInput from "../../ui/FileInput";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";
import FormRow from "../../ui/FormRow";
import { useCreatecabin } from "./useCreatecabin";
import { useEditcabin } from "./useEditcabin";

function CreateCabinForm({ cabintoEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabintoEdit;
  const isEditing = Boolean(editId);
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditing ? editValues : {},
  });
  const { errors } = formState;
  const { mutate, isAdding } = useCreatecabin();
  const { editCabin, isEditting } = useEditcabin();
  const isWorking = isAdding || isEditing;
  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditing)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            {
              reset();
              onCloseModal?.();
            }
          },
        }
      );
    else
      mutate(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

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
              message: "Capacity should be atleast greater than 1",
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
              message: "Price should be atleast greater than 1",
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
          type="number"
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
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button>{isEditing ? "Edit Cabin" : "Add cabin"}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
