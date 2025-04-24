import { z } from 'zod';

/**
 * Represents a customer mailing address.
 *
 * For example, a customer's default address and an order's billing address are both mailling addresses
 */
export const AddressesSchema = z.object({
  /**
   * The first line of the address. Typically the street address or PO Box number.
   */
  address1: z.string().optional(),
  /**
   * The second line of the address. Typically the number of the apartment, suite, or unit.
   */
  address2: z.string().optional(),
  /**
   * The name of the city, district, village, or town.
   */
  city: z.string().optional(),
  /**
   * The name of the customer's company or organization.
   */
  company: z.string().optional(),
  /**
   * The name of the country.
   */
  country: z.string().optional(),
  /**
   * The first name of the customer.
   */
  first_name: z.string().optional(),
  /**
   * A globally-unique identifier.
   */
  id: z.number().optional(),
  /*
   * The last name of the customer.
   */
  last_name: z.string().optional(),
  /**
   * A unique phone number for the customer.
   *
   * Formatted using E.164 standard. For example, +16135551111.
   */
  phone: z.string().optional(),
  /**
   * The region of the address, such as the province, state, or district.
   */
  province: z.string().optional(),
  /**
   * The zip or postal code of the address.
   */
  zip: z.string().optional(),
  /**
   * The two-letter code for the region.
   *
   * For example, ON.
   */
  province_code: z.string().optional(),
  /**
   * The two-letter country code corresponding to the customer's country.
   */
  country_code: z.string().optional(),
  /**
   * The customer's normalized country name.
   */
  country_name: z.string().optional(),
  /**
   * The latitude coordinate of the customer address.
   */
  latitude: z.number().optional(),
  /**
   * The longitude coordinate of the customer address.
   */
  longitude: z.number().optional(),
});
