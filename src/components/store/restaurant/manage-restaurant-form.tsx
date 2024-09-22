"use client";

import withActionStateReset from "@/components/hoc/withActionStateReset";
import FormActions from "@/components/ui/form/form-actions";
import { Form } from "@/components/ui/shadcn/form";
import { Separator } from "@/components/ui/shadcn/separator";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { transformToFormData } from "@/lib/utils/categoryArrayDataProcess";
import { AU_STATES } from "@/lib/utils/constants";
import { restaurantSchema, RestaurantSchema } from "@/schemas/zod/store/restaurant.schema";
import { RestaurantDTO } from "@/services/mongoose/store/restaurant.dal";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CategorySection from "./category-section";
import DeliverySection from "./delivery-section";
import DetailsSection from "./details-section";
import { updateRestaurantAction } from "@/actions/store/restaurant.action";

interface ManageRestaurantFormProps {
  restaurant: RestaurantDTO;
  onReset: () => void;
}

const ManageRestaurantForm = withActionStateReset(({ restaurant, onReset }: ManageRestaurantFormProps) => {
  const { toast } = useToast();

  const form = useForm<RestaurantSchema>({
    mode: "onBlur",
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: restaurant.name,
      contactNumber: restaurant.contactNumber,
      email: restaurant.email,
      street: restaurant.street,
      city: restaurant.city,
      state: restaurant.state as (typeof AU_STATES)[number],
      postcode: restaurant.postcode,
      courses: restaurant.courses.map((course) => ({
        name: course.name,
        image: {
          publicId: course.image.publicId,
          type: course.image.type,
          resourceType: course.image.resourceType,
          version: course.image.version ?? "",
        },
        imageFile: new File([""], "filename"),
      })),
      specialDiets: restaurant.specialDiets.map((option) => ({
        name: option.name,
        image: {
          publicId: option.image.publicId,
          type: option.image.type,
          resourceType: option.image.resourceType,
          version: option.image.version ?? "",
        },
        imageFile: new File([""], "filename"),
      })),
      deliveryFee: restaurant.deliveryFee,
      freeDeliveryThreshold: restaurant.freeDeliveryThreshold,
      estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
    },
  });

  const [actionState, formAction, pending] = useActionState<ActionState<RestaurantSchema>, FormData>(
    updateRestaurantAction,
    null
  );

  const onCancelConfirm = () => {
    form.reset();
    onReset();
  };

  const submitHandler = async (formData: FormData) => {
    if (!form.getValues("state")) {
      formData.set("state", "");
    }

    transformToFormData(form, formData, "courses");
    transformToFormData(form, formData, "specialDiets");

    formAction(formData);
  };

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset();
    }

    if (actionState?.message) {
      if (actionState.message === "success") {
        onReset();
        toast({
          title: "Restaurant updated successfully.",
          description: "Your restaurant details have been updated.",
        });
      } else {
        toast({
          title: "Something went wrong.",
          description: actionState.message,
        });
      }
    }
  }, [form.formState.isDirty, actionState, onReset, form, toast]);

  return (
    <Form {...form}>
      <form action={submitHandler}>
        <DetailsSection actionState={actionState} />
        <Separator className="mt-4 mb-8" />
        <DeliverySection actionState={actionState} />
        <Separator className="mt-4 mb-8" />
        <CategorySection name="courses" actionState={actionState} warningMessage="Removing this course will also delete all dishes under it." />
        <Separator className="mt-4 mb-8" />
        <CategorySection name="specialDiets" actionState={actionState} warningMessage="Removing this special diet will also remove it from all dishes." />
        {form.formState.isDirty && (
          <>
            <Separator className="mt-4 mb-8" />
            <FormActions pending={pending} onCancelConfirm={onCancelConfirm} />
          </>
        )}
      </form>
    </Form>
  );
});

export default ManageRestaurantForm;
