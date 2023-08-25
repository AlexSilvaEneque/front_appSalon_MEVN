import { generateClasses } from '@formkit/themes'

const config = {
    config: {
        classes: generateClasses({
            global: {
                wrapper: 'space-y-2 mb-3',
                message: 'pl-2 border-l-2 border-red-500 inline-block text-red-500 text-sm font-bold mb-2',
                label: 'block mb-1 font-bold text-lg text-white',
                input: 'w-full p-3 border border-gray-300 rounded text-gray-700 placeholder-gray-600'
            },
            submit: {
                input: '$reset bg-blue-500 hover:bg-blue-600 rounded text-white font-bold w-full p-3 mt-10'
            }
        })
    }
}

export default config