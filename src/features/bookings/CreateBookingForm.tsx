import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import { useForm, FieldErrors } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { useCreateBooking } from "./useCreateBooking";
import { useEditBooking } from "./useEditBooking";
import { useCabins } from "../cabins/useCabins";
import { Booking, Cabin } from "../../types";



type BookingToEdit = Partial<Booking> & {
  id?: string;
};

type CreateBookingFormProps = {
  bookingtoEdit?: BookingToEdit;
  onCloseModal?: () => void;
};

function CreateBookingForm({
  bookingtoEdit = {},
  onCloseModal,
}: CreateBookingFormProps) {
  const { isLoading, cabins } = useCabins();
  const { id: editId, ...editValues } = bookingtoEdit;
  const isEditing = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm<Booking>({
    defaultValues: isEditing ? (editValues as Booking) : {},
  });
  const { errors }: { errors: FieldErrors<Booking> } = formState;

  const { mutate: createBooking, isLoading:isAdding } = useCreateBooking();
  const {  editBooking, isEditting: isEditingBooking } = useEditBooking();
  const isWorking = isAdding || isEditingBooking;

  const onSubmitBooking = (data: Booking) => {
    if (isEditing) {
      editBooking(
        { newBookingData: { ...data }, id: editId! },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createBooking({data}, {
        onSuccess: () => {
          reset();
          onCloseModal?.();
        },
      });
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmitBooking)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Guest name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "Mandatory to fill" })}
        />
      </FormRow>

      <FormRow label="Email" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register("email", { required: "This field is mandatory!" })}
        />
      </FormRow>

      <FormRow label="National Id" error={errors?.nationalID?.message}>
        <Input
          type="number"
          id="nationalID"
          {...register("nationalID", { required: "This field is mandatory!" })}
        />
      </FormRow>

      <FormRow label="Nationality" error={errors?.nationality?.message}>
        <Input
          type="text"
          id="nationality"
          {...register("nationality", { required: "This field is mandatory!" })}
        />
      </FormRow>

      <FormRow label="Start Date" error={errors?.startDate?.message}>
        <Input
          type="date"
          id="startDate"
          {...register("startDate", { required: "Mandatory to fill" })}
        />
      </FormRow>

      <FormRow label="End Date" error={errors?.endDate?.message}>
        <Input
          type="date"
          id="endDate"
          {...register("endDate", { required: "Mandatory to fill" })}
        />
      </FormRow>

      <FormRow label="Number of Guests" error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          {...register("numGuests", { required: "This field is mandatory!" })}
        />
      </FormRow>

      <FormRow label="Cabin" error={errors?.cabinId?.message}>
        <select
          className="cabinSelect"
          id="cabinId"
          {...register("cabinId", { required: "This field is mandatory" })}
        >
          {!isLoading &&
            cabins &&
            cabins.map((cabin:Cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.id}
              </option>
            ))}
        </select>
      </FormRow>

      <FormRow label="Is Paid?" error={errors?.isPaid?.message}>
        <select
          className="cabinSelect"
          id="isPaid"
          {...register("isPaid", { required: "This field is mandatory" })}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
      </FormRow>

      <FormRow label="Observations" error={errors?.observations?.message}>
        <Textarea
          id="observations"
          {...register("observations", { required: "This field is mandatory!" })}
          defaultValue=""
        />
      </FormRow>

      <FormRow label="Has Breakfast?" error={errors?.hasBreakfast?.message}>
        <select
          className="cabinSelect"
          id="hasBreakfast"
          {...register("hasBreakfast", { required: "This field is mandatory" })}
        >
          <option value="false">False</option>
          <option value="true">True</option>
        </select>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditing ? "Edit Booking" : "Add Booking"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateBookingForm;
