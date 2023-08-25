<script setup>
    import ServiceItem from '../../components/ServiceItem.vue'
    import { useServiceStore } from '../../stores/services'

    const store = useServiceStore()
</script>

<template>
    <div>
        <h2 class="text-4xl font-extrabold text-white">Servicios</h2>
        <p class="text-white text-lg">A continuación elige al menos un servicio para tu cita</p>

        <div class="grid grid-cols-2 gap-5 mt-5">
            <ServiceItem
                v-for="service in store.services"
                :key="service._id"
                :service="service"
            />
        </div>
    </div>
</template>