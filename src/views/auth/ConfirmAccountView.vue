<script setup>
    import { onMounted, inject } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import AuthAPI from '../../api/AuthAPI'

    const route = useRoute()
    const router = useRouter()
    const { token } = route.params

    const toast = inject('toast')

    onMounted(async () => {
        try {
            const { data } = await AuthAPI.verifyAccount(token)
            toast.open({
                message: data.msg,
                type: 'success'
            })
            setTimeout(() => {
                router.push({ name: 'login' })
            }, 5000)
        } catch (error) {
            toast.open({
                message: error.response.data.msg,
                type: 'error'
            })
        }
    })
</script>

<template>
    <h1 class="text-4xl font-bold text-center text-white">Verificar Cuenta</h1>
</template>