import { ref, computed, onMounted, inject, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import AppointmentAPI from '../api/AppointmentAPI'
import { convertToISO, convertoDDMMYYYY } from '../helpers/date'
import { useUserStore } from './user'

export const useAppointmentsStore = defineStore('appointments', () => {

    const appointmentId = ref('')
    const services = ref([])
    const date = ref('')
    const hours = ref([])
    const time = ref('')
    const appointmentsByDate = ref([])

    const toast = inject('toast')
    const router = useRouter()
    const user = useUserStore()

    onMounted(() => {
          const startHour = 10
          const endHour = 19
          for (let hour = startHour; hour <= endHour; hour++) {
            hours.value.push(hour + ':00')
          }
    })

    watch(date, async () => {
        time.value = ''
        if (date.value === '') {
            return
        }
        // Obtener las horas de citas por fecha
        const { data } = await AppointmentAPI.getbyDate(date.value)

        if (appointmentId.value) {
            // edición

            // habilitamos la hora de la cita a editar
            appointmentsByDate.value = data.filter(appointment => appointment._id !== appointmentId.value)

            // seleccionamos la hora que tenía reservada la cita
            time.value = data.filter(appointment => appointment._id === appointmentId.value)[0].time

        } else {
            // registro nuevo
            appointmentsByDate.value = data
        }
    })

    function setSelectedAppointment(appointment) {
        services.value = appointment.services
        date.value = convertoDDMMYYYY(appointment.date)
        // time.value = appointment.time
        appointmentId.value = appointment._id
    }

    function onServiceSelected(service) {
        if (services.value.some(selectedService => selectedService._id === service._id)) {
            // está en lista
            services.value = services.value.filter(selectedService => selectedService._id !== service._id)
        } else {
            if (services.value.length === 2) {
                alert('Máximo 2 servicios por cita')
                return
            }
            services.value.push(service)
        }
    }

    async function saveAppointment() {
        const appointment = {
            services: services.value.map(service => service._id),
            date: convertToISO(date.value),
            time: time.value,
            totalAmount: totalAmount.value
        }

        if (appointmentId.value) {
            try {
                const { data } = await AppointmentAPI.update(appointmentId.value, appointment)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
                
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                const { data } = await AppointmentAPI.create(appointment)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
            } catch (error) {
                console.log(error)
            }
        }

        $reset()
        user.getUserAppointments()
        router.push({ name: 'my-appointments' })
    }

    async function cancelAppointment(id) {
        if (confirm('¿Desea cancelar esta cita?')) {
            try {
                const { data } = await AppointmentAPI.delete(id)
                toast.open({
                    message: data.msg,
                    type: 'success'
                })
                // user.getUserAppointments()
                user.userAppointments = user.userAppointments.filter(appointment => appointment._id !== id)
            } catch (error) {
                toast.open({
                    message: error.response.data.msg,
                    type: 'error'
                })
            }   
        }
    }

    function $reset() {
        services.value = []
        date.value = ''
        time.value = ''
        appointmentId.value = ''
    }

    const isServiceSelected = computed(() => {
        return (id) => services.value.some(service => service._id === id)
    })

    const noServicesSelected = computed(() => services.value.length === 0)

    const totalAmount = computed(() => {
        return services.value.reduce((total, service) => total +  service.price, 0)
    })

    const isValidReservation = computed(() => {
        return services.value.length && date.value.length && time.value.length
    })

    const isDateSelected = computed(() => {
        return date.value ? true : false
    })

    const disableTime = computed(() => {
        return (hour) => {
            return appointmentsByDate.value.find(appointment => appointment.time === hour)
        }
    })

    return {
        services,
        date,
        hours,
        time,
        setSelectedAppointment,
        onServiceSelected,
        saveAppointment,
        cancelAppointment,
        $reset,
        isServiceSelected,
        noServicesSelected,
        totalAmount,
        isValidReservation,
        isDateSelected,
        disableTime
    }
})