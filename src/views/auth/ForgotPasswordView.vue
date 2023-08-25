<script setup>
    import { inject } from 'vue'
    import { reset } from '@formkit/vue'
    import AuthAPI from '../../api/AuthAPI'

    const toast = inject('toast')

    const handleSubmit = async ({ email }) => {
        try {
            const { data } = await AuthAPI.forgotPassword({ email })
            toast.open({
                message: data.msg,
                type: 'success'
            })
        } catch (error) {
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        } finally {
            reset('forgotPasswordForm')
        }
    }
</script>

<template>
    <h1 class="text-4xl font-bold text-center text-white">Olvidé mi contraseña</h1>
    <p class="text-xl text-white text-center my-5">Recupera el acceso a tu cuenta</p>

    <FormKit
        id="forgotPasswordForm"
        type="form"
        :actions="false"
        incomplete-message="No se pudo enviar, revisa las notificaciones"
        @submit="handleSubmit"
    >
        <FormKit
            type="email"
            label="Email"
            name="email"
            placeholder="Email de usuario"
            validation="required|email"
            :validation-messages="{
                required: 'El email es obligatorio',
                email: 'Email no válido'
            }"
        />

        <FormKit type="submit">Enviar Instrucciones</FormKit>
    </FormKit>
</template>