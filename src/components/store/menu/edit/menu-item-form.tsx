"use client";

import { updateMenuItemAction } from "@/actions/store/menu.action";
import withActionStateReset from "@/components/hoc/withActionStateReset";
import FormActions from "@/components/ui/form/form-actions";
import { CheckboxItem } from "@/components/ui/form/form-checkbox";
import { Form } from "@/components/ui/shadcn/form";
import { useToast } from "@/components/ui/shadcn/use-toast";
import { menuSchema, MenuSchema } from "@/schemas/zod/store/menu.schema";
import { DishDTO } from "@/services/mongoose/store/dish.dal";
import { ActionState } from "@/types/ActionState";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { memo, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AdditionalInfoSection from "./additional-info-section";
import CustomisationSection from "./customisation-section";
import DetailsSection from "./details-section";
import FeaturesSection from "./features-section";
import SpecialDietsSection from "./special-diets-section";

interface MenuFormProps {
  searchParams?: any;
  dish?: DishDTO;
  courses: CheckboxItem[];
  specialDiets: CheckboxItem[];
  onReset: () => void;
}

const MenuForm = withActionStateReset(({ searchParams, dish, courses, specialDiets, onReset }: MenuFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<MenuSchema>({
    mode: "onBlur",
    resolver: zodResolver(menuSchema),
    defaultValues: {
      course: dish?.course ?? "",
      name: dish?.name ?? "",
      description: dish?.description ?? "",
      price: dish?.price ?? 0,
      customisation: {
        addOns: dish?.customisation?.addOns ?? [],
        specialInstructions: dish?.customisation?.specialInstructions ?? true,
      },
      specialDiets: dish?.specialDiets.map(({ slug }) => slug) ?? [],
      onlineAvailable: dish?.onlineAvailable ?? true,
      featured: dish?.featured ?? false,
      popular: dish?.popular ?? false,
      image: {
        publicId: dish?.image.publicId ?? "",
        type: dish?.image.type ?? "",
        resourceType: dish?.image.resourceType ?? "",
        version: dish?.image.version ?? "",
      },
      imageFile: new File([""], "filename"),
    },
  });

  const [actionState, formAction, pending] = useActionState<ActionState<MenuSchema>, FormData>(
    updateMenuItemAction.bind(null, dish?._id),
    null
  );

  const onCancelConfirm = () => {
    form.reset();
    onReset();
  };

  const submitHandler = async (formData: FormData) => {
    const valuesToSet = {
      course: form.getValues("course") || "",
      customisation: JSON.stringify(form.getValues("customisation")),
      image: JSON.stringify(form.getValues("image")),
      imageFile: form.getValues("imageFile"),
      onlineAvailable: form.getValues("onlineAvailable") ? "true" : "false",
      featured: form.getValues("featured") ? "true" : "false",
      popular: form.getValues("popular") ? "true" : "false",
      specialDiets: JSON.stringify(form.getValues("specialDiets")),
    };

    Object.entries(valuesToSet).forEach(([key, value]) => {
      formData.set(key, value);
    });

    formAction(formData);
  };

  useEffect(() => {
    if (!form.formState.isDirty) {
      form.reset();
    }

    if (!actionState?.message) return;

    if (actionState.message === "success") {
      let title, description;

      if (dish?._id) {
        title = "Menu updated successfully.";
        description = "Your dish details have been updated.";
        onReset();
      } else {
        title = "Dish created successfully.";
        description = "Your dish has been added to the menu.";
        onReset();

        let url = "/store/menu";

        if (searchParams) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("id", actionState.payload);
          url += "?" + newSearchParams.toString();
        } else {
          url += "/" + actionState.payload;
        }

        router.replace(url, { scroll: false });
      }

      toast({ title, description });
    } else {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: actionState.message,
      });
    }
  }, [
    form.formState.isDirty,
    actionState,
    onReset,
    form,
    toast,
    router,
    dish?._id,
    actionState?.payload,
    searchParams,
  ]);

  return (
    <Form {...form}>
      <form action={submitHandler}>
        <div className="relative">
          <DetailsSection actionState={actionState} courses={courses} />
          <FeaturesSection />
          <SpecialDietsSection specialDiets={specialDiets} />
          <CustomisationSection actionState={actionState} />
          <AdditionalInfoSection actionState={actionState} imagePublicId={dish?.image.publicId} />
        </div>
        {(form.formState.isDirty || !dish) && <FormActions pending={pending} onCancelConfirm={onCancelConfirm} />}
      </form>
    </Form>
  );
});

const arePropsEqual = (
  prevProps: Readonly<Omit<MenuFormProps, "onReset">>,
  nextProps: Readonly<Omit<MenuFormProps, "onReset">>
) => {
  return (
    prevProps.dish?._id.toString() === nextProps.dish?._id.toString() &&
    prevProps.dish?.updatedAt === nextProps.dish?.updatedAt &&
    prevProps.courses.length === nextProps.courses.length &&
    prevProps.courses.every((course, index) => course.value === nextProps.courses[index].value) &&
    prevProps.specialDiets.length === nextProps.specialDiets.length &&
    prevProps.specialDiets.every((specialDiets, index) => specialDiets.value === nextProps.specialDiets[index].value)
  );
};

export default memo(MenuForm, arePropsEqual);
