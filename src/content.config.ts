import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const cms = defineCollection({})
const page = defineCollection({})

export const lang = defineCollection({})
export const allBlogPosts = {}