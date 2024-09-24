import Map from "@/components/contact/map";
import { Button } from "@/components/ui/shadcn/button";
import { OPENING_HOURS } from "@/lib/utils/constants";
import { forwardGeocoding } from "@/services/api/locationIq";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { parsePhoneNumber } from "libphonenumber-js";
import Link from "next/link";

export default async function Page() {
  const { name, street, city, state, postcode, contactNumber, email } = await getRestaurant();
  const address = `${street} ${city} ${state} ${postcode}`;

  const [coord] = await forwardGeocoding(address);

  return (
    <div className="w-screen min-h-screen pt-28 sm:pt-32 px-5 sm:px-10 bg-stone-50">
      <div className="grid lg:grid-cols-2 gap-8 lg:py-20">
        <div>
          <h4 className="heading-4 font-medium uppercase mb-10">contact us</h4>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-8">
              <h2 className="heading-2 font-semibold uppercase">{name}</h2>
              <div className="space-y-2 2xl:text-lg">
                {OPENING_HOURS.map((openingHour) => (
                  <div key={openingHour.day} className="flex items-start gap-6 body-3">
                    <p className="uppercase font-medium">{openingHour.day}</p>
                    <div className="flex flex-col items-end">
                      {openingHour.hours.map((hour) => (
                        <p className="text-nowrap" key={hour}>
                          {hour}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="default-active" size="lg" className="rounded-full" asChild>
                <Link href={`mailto:${email}`}>Email us</Link>
              </Button>
            </div>
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="heading-2 font-medium">Location</h2>
                <p className="body-3 mb-2 text-balance">{address}</p>
              </div>
              <div className="space-y-6">
                <h2 className="heading-2 font-medium">Phone</h2>
                <p className="body-3 mb-2">{parsePhoneNumber(contactNumber)?.formatNational() || contactNumber}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-96 lg:h-112">
          <Map latitude={+coord.lat} longitude={+coord.lon} />
        </div>
      </div>
    </div>
  );
}
