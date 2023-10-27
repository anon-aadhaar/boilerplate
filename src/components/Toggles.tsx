import { Dispatch, SetStateAction } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type ToggleProps = {
    withCert: boolean;
    setWithCert: Dispatch<SetStateAction<boolean>>
}

export function Toggle({withCert, setWithCert}: ToggleProps) {
  return (
    <>
    <Switch
      checked={withCert}
      onChange={setWithCert}
      className={classNames(
        withCert ? 'bg-indigo-600' : 'bg-gray-200',
        'self-center relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out'
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={classNames(
            withCert ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
    <p>{withCert ? "With certificate" : "Without certificate"}</p>
    </>
  )
}