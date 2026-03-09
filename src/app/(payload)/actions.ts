'use server'

import { handleServerFunctions } from '@payloadcms/next/layouts'
import configPromise from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import type { ServerFunctionClient } from 'payload'

export const serverFunction: ServerFunctionClient = async function (args) {
  const headers = await getHeaders()
  return handleServerFunctions({
    ...args,
    config: configPromise,
    headers,
  })
}
