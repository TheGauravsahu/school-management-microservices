import z from "zod";
import {
  RELIGION_ENUM,
  BLOOD_GROUP_ENUM,
  CATEGORY_ENUM,
  NATIONALITY_ENUM,
  GENDER_ENUM,
} from "../models/consonants";

export const createStudentSchema = z.object({
  userId: z.string({ message: "User ID is required." }).min(1),
  parentId: z.string({ message: "Parent ID is required." }).min(1),

  email: z.string({ message: "Email is required." }).email(),
  mobileNumber: z
    .string({ message: "Mobile number is required." })
    .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian mobile number." }),
  aadhaarNumber: z
    .string({ message: "Adhar number is required." })
    .regex(/^\d{12}$/, { message: "Aadhar number must be 12 digits." }),

  dateOfBirth: z
    .string({ message: "Valid date of birth is required." })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    })
    .transform((val) => new Date(val)),

  firstName: z.string({ message: "First name is required." }),
  lastName: z.string({ message: "Last name is required." }),
  age: z.number().int().positive(),
  class: z.number().int().positive().max(12),
  section: z.string({ message: "Section is required." }),
  rollNumber: z.number(),

  fatherName: z.string({ message: "Father's name is required." }),
  motherName: z.string({ message: "Mother's name is required." }),
  address: z.object({
    village: z.string({ message: "Village is required." }),
    post: z.string({ message: "Post is required." }),
    block: z.string({ message: "Block is required." }),
    district: z.string({ message: "District is required." }),
    state: z.string({ message: "State is required." }),
    zipCode: z.string({ message: "Zip code is required." }),
  }),

  gender: z.enum(GENDER_ENUM, { message: "Invalid gender." }),
  religion: z.enum(RELIGION_ENUM).optional(),
  bloodGroup: z.enum(BLOOD_GROUP_ENUM).optional(),
  category: z.enum(CATEGORY_ENUM).optional(),
  nationality: z.enum(NATIONALITY_ENUM).optional(),
});

export const studentQuerySchema = z.object({
  classNumber: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Class number must be a number." })
    .optional(),
  section: z.string().optional(),
  gender: z.enum(GENDER_ENUM, { message: "Invalid gender." }).optional(),
  parentId: z.string().optional(),
  page: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Page must be a number." })
    .optional(),
  limit: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "Limit must be a number." })
    .optional(),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof createStudentSchema>;
