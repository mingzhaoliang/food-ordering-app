import { OPENING_HOURS } from "@/lib/utils/constants";
import { getRestaurant } from "@/services/mongoose/store/restaurant.dal";
import { parsePhoneNumber } from "libphonenumber-js";
import Link from "next/link";

export default async function Footer() {
  const { street, city, state, postcode, contactNumber } = await getRestaurant();
  const address = `${street} ${city} ${state} ${postcode}`;

  return (
    <div className="sm:sticky p-10 z-0 left-0 right-0 bottom-0 bg-black text-white grid sm:grid-cols-3 gap-x-8 gap-y-4">
      <div>
        <h4 className="heading-4 uppercase font-bold mb-2 sm:mb-4">address</h4>
        <p className="body-3 mb-2 text-balance max-w-64 leading-relaxed">{address}</p>
        <p className="body-3">{parsePhoneNumber(contactNumber)?.formatNational() || contactNumber}</p>
      </div>
      <div>
        <h4 className="heading-4 uppercase font-bold mb-2 sm:mb-4">opening hours</h4>
        <div className="space-y-2 2xl:text-lg">
          {OPENING_HOURS.map((openingHour) => (
            <div key={openingHour.day} className="flex items-start gap-8 body-3">
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
      </div>
      <div>
        <h4 className="heading-4 uppercase font-bold mb-2 sm:mb-4">useful links</h4>
        <div className="uppercase flex flex-col items-start gap-2 body-3">
          <Link href="/menu" className="hover:underline">
            Menu
          </Link>
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
