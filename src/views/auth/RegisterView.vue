<script setup>
    import { inject } from 'vue'
    import { reset } from '@formkit/vue'
    import AuthAPI from '../../api/AuthAPI'

    const toast = inject('toast')

    const handleSubmit = async ({ password_confirm, ...formData }) => {
        try {
            const { data } = await AuthAPI.register(formData)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            reset('registerForm')
        } catch (error) {
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }

</script>

<template>
    <h1 class="text-4xl font-bold text-center text-white">Crea una cuenta</h1>
    <p class="text-xl text-white text-center my-5">Crea una cuenta en AppSalon</p>

    <FormKit
        id="registerForm"
        type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revisa las notificaciones"
        @submit="handleSubmit"
    >
    <!-- :actions="false" hacemos que no salga el botob submit por defecto -->
        <FormKit
            type="text"
            label="Nombre"
            name="name"
            placeholder="Tu Nombre"
            validation="required|length:3"
            :validation-messages="{
                required: 'El nombre es obligatorio',
                length: 'El nombre es muy corto'
            }"
        />

        <FormKit
            type="email"
            label="Email"
            name="email"
            placeholder="Email de registro"
            validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }"
        />

        <FormKit
            type="password"
            label="Password"
            name="password"
            placeholder="Password de usuario - Min 8 caracteres"
            validation="required|length:8"
            :validation-messages="{
                required: 'El password es obligatorio',
                length: 'El password debe contener al menos 8 caracteres'
            }"
        />

        <FormKit
            type="password"
            label="Repetir Password"
            name="password_confirm"
            placeholder="Repite el password"
            validation="required|confirm"
            :validation-messages="{
                required: 'Repetir password es obligatorio',
                confirm: 'Los password no son iguales'
            }"
        />

        <FormKit type="submit">Crear Cuenta</FormKit>
    </FormKit>
</template>