'use client'
import ICoverStructureField from '@/app/utils/interfaces/cover-structure/cover-structure-field';
import IFieldOption from '@/app/utils/interfaces/cover-structure/field-option';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import React from 'react'
import { Control, Controller, FieldErrors, FieldValues, UseFormWatch } from 'react-hook-form';
import Grid from '@mui/material/Grid2';

interface FieldRenderProps{
    fields: ICoverStructureField[],
    options: IFieldOption[],
    control: Control<FieldValues,any>
    errors: FieldErrors<FieldValues>
    watch: UseFormWatch<FieldValues>
}


export default function FieldRender({fields, options, control, errors, watch}: FieldRenderProps){


    const getOptions = (lookupTitle: string) => {
        return options.find(option => option.lookupType === lookupTitle)?.values || [];
    }

    return (
    <Grid container spacing={2}>
        {fields.map( (fieldConfig, index) =>{
            
        switch (fieldConfig.type) {
            case 'options':
                return (
                    <Grid size={{sm:12, xs:12, md:6}} key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>{field.name}</InputLabel>
                                <Select error={!!errors[field.name]} {...field} label={field.name} value={field.value ?? ''}>
                                    {getOptions(fieldConfig.defaultValue||"")?.map((option: string) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    </Grid>
                );
            case 'date':
                return (
                    <Grid size={{sm:12, xs:12, md:6}}  key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        render={({ field }) => (
                            <DatePicker
                                {...field}
                                label={field.name}
                                value={field.value ? dayjs(field.value) : null}
                                onChange={(date) => field.onChange(date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: !!errors[field.name],
                                        helperText: errors[field.name] ? errors[field.name]?.message?.toString() : ''
                                    }
                                }}
                            />
                        )}
                    />
                    </Grid>
                );
            case 'number':
                return (
                    <Grid size={{sm:12, xs:12, md:6}}  key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        rules={{ required: fieldConfig.isRequired }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="number"
                                label={field.name}
                                fullWidth
                                value={field.value ?? ''}
                                error={!!errors[field.name]}
                                helperText={errors[field.name] ? errors[field.name]?.message?.toString() : ''}
                            />
                        )}
                    />
                    </Grid>
                );
            case 'boolean':
                return (
                    <Grid size={{sm:12, xs:12, md:6}}  key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        rules={{ required: fieldConfig.isRequired }}
                        render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox {...field} checked={field.value ?? false} />}
                                label={field.name}
                            />
                        )}
                    />
                    </Grid>
                );
            case 'text':
                return (
                    <Grid size={{sm:12, xs:12, md:6}}  key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        rules={{ required: fieldConfig.isRequired, 
                            pattern: fieldConfig.validationPattern ? new RegExp(fieldConfig.validationPattern) : undefined}}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="text"
                                label={field.name}
                                fullWidth
                                value={field.value ?? ''}
                                error={!!errors[field.name]}
                                helperText={errors[field.name] ? errors[field.name]?.message?.toString()+" "+fieldConfig.hint : ''}
                            />
                        )}
                    />
                    </Grid>
                );
            case 'expanded-text':
                return (
                    <Grid size={{sm:12, xs:12, md:6}}  key={index}>
                    <Controller
                        name={fieldConfig.name}
                        control={control}
                        rules={{ required: fieldConfig.isRequired, 
                            validate:(value) => value < watch('License Expiry Date')
                         }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label={field.name}
                                multiline
                                rows={4}
                                fullWidth
                                error={!!errors[field.name]}
                                helperText={errors[field.name] ? errors[field.name]?.message?.toString(): ''}
                            />
                        )}
                    />
                    </Grid>
                )
            default:
                return null;
        }
    })
    }
    </Grid>)
}
