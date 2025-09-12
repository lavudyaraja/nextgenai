'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { CheckCircle, Download, Upload, Trash2, Shield } from 'lucide-react'

interface DataControlsSettingsProps {
  onSave?: () => void
}

export function DataControlsSettings({ onSave }: DataControlsSettingsProps) {
  const [message, setMessage] = useState<string>('')

  const handleExportData = () => {
    // In a real app, this would export user data
    console.log('Exporting data')
    setMessage('Data export started. You will receive an email when it\'s ready.')
  }

  const handleImportData = () => {
    // In a real app, this would import user data
    console.log('Importing data')
    setMessage('Data import started. This may take a few minutes.')
  }

  const handleDeleteData = () => {
    // In a real app, this would delete user data
    console.log('Deleting data')
    setMessage('Data deletion scheduled. This may take a few minutes.')
  }

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user account
    console.log('Deleting account')
    setMessage('Account deletion scheduled. You will receive a confirmation email.')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Controls</CardTitle>
          <CardDescription>Manage your data and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {message && (
            <Alert className="border-green-500 text-green-500">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Export</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Export Your Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Download a copy of your data in a machine-readable format
                  </p>
                </div>
                <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Import</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Import Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Import data from a previous export or another service
                  </p>
                </div>
                <Button onClick={handleImportData} variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Data Deletion</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Your Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your data from our systems
                  </p>
                </div>
                <Button onClick={handleDeleteData} variant="outline" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Data
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Account Deletion</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button onClick={handleDeleteAccount} variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Data Privacy</h4>
                <p className="text-sm text-muted-foreground">
                  We take your privacy seriously. All data exports are encrypted and deleted after 7 days. 
                  Account deletion is irreversible and will remove all your data from our systems.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}