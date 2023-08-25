<script setup>
    import { inject } from 'vue'
    import { useRouter } from 'vue-router'
    import AuthAPI from '../../api/AuthAPI'

    const toast = inject('toast')
    const router = useRouter()

    const handleSubmit = async (formData) => {
        try {
            const { data: { token } } = await AuthAPI.login(formData)
            localStorage.setItem('AUTH_TOKEN', token)
            router.push({ name: 'my-appointments' })
        } catch (error) {
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    }
</script>

<template>
    <h1 class="text-4xl font-bold text-center text-white">Iniciar Sesión</h1>
    <p class="text-xl text-white text-center my-5">Si tienes una cuenta, inicia sesión</p>

    <FormKit
        id="loginForm"
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

        <FormKit
            type="password"
            label="Password"
            name="password"
            placeholder="Password de usuario"
            validation="required"
            :validation-messages="{
                required: 'El password es obligatorio'
            }"
        />

        <FormKit type="submit">Iniciar Sesión</FormKit>
    </FormKit>
</template>