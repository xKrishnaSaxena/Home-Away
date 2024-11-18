import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useEditSettings } from "./useEditSettings";
import { useSettings } from "./useSettings";

function UpdateSettingsForm() {
  const {
    isLoading,
    settings: {
      minBookingLength,
      maxBookingLength,
      maxGuests,
      breakfastPrice,
    } = {},
  } = useSettings();

  const { editSettings, isEditting } = useEditSettings();

  if (isLoading) return <Spinner />;

  function handleEdit(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 
    field: string) {
    const { value } = e.target;
    if (!value) return;
    editSettings({ [field]: value });
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          disabled={isEditting}
          defaultValue={minBookingLength}
          onBlur={(e) => handleEdit(e, "minBookingLength")}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          disabled={isEditting}
          defaultValue={maxBookingLength}
          onBlur={(e) => handleEdit(e, "maxBookingLength")}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          disabled={isEditting}
          defaultValue={maxGuests}
          onBlur={(e) => handleEdit(e, "maxGuests")}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          disabled={isEditting}
          defaultValue={breakfastPrice}
          onBlur={(e) => handleEdit(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
