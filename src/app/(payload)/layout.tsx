import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import configPromise from '@payload-config'
import { importMap } from './importMap'
import { serverFunction } from './actions'

import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) => (
  <RootLayout config={configPromise} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
