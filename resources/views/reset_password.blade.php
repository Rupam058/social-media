<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="UTF-8">
   <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
   >
   <title>Reset Password - {{ config('app.name') }}</title>
   @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body
   class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center p-4"
>
   <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
         <div
            class="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
         >
            <svg
               class="w-8 h-8 text-indigo-600"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
            >
               <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
               ></path>
            </svg>
         </div>
         <h1 class="text-2xl font-bold text-gray-900 mb-2">Reset Your Password
         </h1>
         <p class="text-gray-600">Enter your new password below</p>
      </div>

      <!-- Error Messages -->
      @if ($errors->any())
         <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex">
               <svg
                  class="w-5 h-5 text-red-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
               >
                  <path
                     fill-rule="evenodd"
                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                     clip-rule="evenodd"
                  ></path>
               </svg>
               <div>
                  <h3 class="text-sm font-medium text-red-800">Please fix the
                     following errors:</h3>
                  <ul class="mt-1 text-sm text-red-700 list-disc list-inside">
                     @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                     @endforeach
                  </ul>
               </div>
            </div>
         </div>
      @endif

      <!-- Success Message -->
      @if (session('status'))
         <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div class="flex">
               <svg
                  class="w-5 h-5 text-green-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
               >
                  <path
                     fill-rule="evenodd"
                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                     clip-rule="evenodd"
                  ></path>
               </svg>
               <p class="text-sm text-green-700">{{ session('status') }}</p>
            </div>
         </div>
      @endif

      <!-- Form -->
      <form
         method="POST"
         class="space-y-6"
      >
         @csrf

         <!-- Password Field -->
         <div>
            <label
               for="password"
               class="block text-sm font-medium text-gray-700 mb-2"
            >
               New Password
            </label>
            <div class="relative">
               <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your new password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 @error('password') border-red-500 @enderror"
               >
               <button
                  type="button"
                  onclick="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
               >
                  <svg
                     id="eye-open"
                     class="w-5 h-5 text-gray-400 hover:text-gray-600"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                     ></path>
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                     ></path>
                  </svg>
                  <svg
                     id="eye-closed"
                     class="w-5 h-5 text-gray-400 hover:text-gray-600 hidden"
                     fill="none"
                     stroke="currentColor"
                     viewBox="0 0 24 24"
                  >
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                     ></path>
                  </svg>
               </button>
            </div>
            @error('password')
               <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
         </div>

         <!-- Confirm Password Field -->
         {{-- <div>
                <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    placeholder="Confirm your new password"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
            </div>

            <!-- Password Requirements -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
                <ul class="text-xs text-gray-600 space-y-1">
                    <li class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        At least 8 characters long
                    </li>
                    <li class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Contains uppercase and lowercase letters
                    </li>
                    <li class="flex items-center">
                        <svg class="w-3 h-3 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        Contains at least one number
                    </li>
                </ul>
            </div> --}}

         <!-- Submit Button -->
         <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
         >
            Reset Password
         </button>
      </form>

      <!-- Back to Login -->
      {{-- <div class="mt-6 text-center">
         <a
            href="{{ route('login') }}"
            class="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
         >
            ← Back to Login
         </a>
      </div> --}}
   </div>

   <script>
      function togglePassword() {
         const passwordInput = document.getElementById('password');
         const eyeOpen = document.getElementById('eye-open');
         const eyeClosed = document.getElementById('eye-closed');

         if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeOpen.classList.add('hidden');
            eyeClosed.classList.remove('hidden');
         } else {
            passwordInput.type = 'password';
            eyeOpen.classList.remove('hidden');
            eyeClosed.classList.add('hidden');
         }
      }
   </script>
</body>

</html>
