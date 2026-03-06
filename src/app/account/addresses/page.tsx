'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MapPin, Plus, Trash2, Star } from 'lucide-react'
import { useAddresses, useCreateAddress, useDeleteAddress } from '@/hooks/useApi'
import type { Address } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'

type FormData = Omit<Address, 'id' | 'user'>

export default function AddressesPage() {
    const { data: addresses, isLoading } = useAddresses()
    const createAddress = useCreateAddress()
    const deleteAddress = useDeleteAddress()
    const [open, setOpen] = useState(false)

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: { country: 'US', is_default: false },
    })

    const onSubmit = async (data: FormData) => {
        await createAddress.mutateAsync(data)
        reset()
        setOpen(false)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-display font-semibold">Addresses</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="h-4 w-4 mr-1.5" />Add Address</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader><DialogTitle>New Address</DialogTitle></DialogHeader>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Street address</Label>
                                <Input {...register('line1', { required: 'Required' })} />
                                {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Apt, suite, etc.</Label>
                                <Input {...register('line2')} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label>City</Label>
                                    <Input {...register('city', { required: 'Required' })} />
                                    {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <Label>State</Label>
                                    <Input {...register('state', { required: 'Required' })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>ZIP</Label>
                                    <Input {...register('postal_code', { required: 'Required' })} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Country</Label>
                                <Input {...register('country', { required: 'Required' })} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_default" checked={!!watch('is_default')}
                                          onCheckedChange={v => setValue('is_default', !!v)} />
                                <Label htmlFor="is_default" className="cursor-pointer font-normal">Set as default address</Label>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>Cancel</Button>
                                <Button type="submit" disabled={createAddress.isPending}>
                                    {createAddress.isPending ? 'Saving…' : 'Save Address'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
                </div>
            ) : addresses?.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
                        <p className="font-medium">No addresses saved</p>
                        <p className="text-sm text-muted-foreground mt-1">Add an address for faster checkout.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {addresses?.map(addr => (
                        <Card key={addr.id}>
                            <CardContent className="p-5 flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium">{addr.line1}</p>
                                        {addr.line2 && <p className="text-xs text-muted-foreground">{addr.line2}</p>}
                                        <p className="text-xs text-muted-foreground">
                                            {addr.city}, {addr.state} {addr.postal_code}, {addr.country}
                                        </p>
                                        {addr.is_default && (
                                            <Badge variant="secondary" className="mt-1.5 gap-1">
                                                <Star className="h-3 w-3" /> Default
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteAddress.mutate(addr.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}