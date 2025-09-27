import { z } from 'zod';
import { ComponentSchema } from '../schemas';

interface GenerateComponentOptions {
  componentType: 'navbar' | 'hero' | 'card' | 'button' | 'footer';
  style?: string;
}

const componentTemplates = {
  navbar: `
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Brand
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/services" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Services
              </Link>
              <Link href="/contact" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}`,
  
  hero: `
export default function Hero() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-blue-600">Start your free trial today.</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
            fugiat veniam occaecat fugiat aliqua.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get started
              </a>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  card: `
export default function Card({ title, description, image, action }: {
  title: string;
  description: string;
  image?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {image && (
        <div className="px-4 py-5 sm:p-6">
          <img className="w-full h-48 object-cover rounded-lg" src={image} alt={title} />
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        {action && (
          <a
            href={action.href}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {action.label}
          </a>
        )}
      </div>
    </div>
  );
}`,

  button: `
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`}
      {...props}
    >
      {children}
    </button>
  );
}`,

  footer: `
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/about" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
              <li><Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
              <li><Link href="/careers" className="text-base text-gray-500 hover:text-gray-900">Careers</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/help" className="text-base text-gray-500 hover:text-gray-900">Help Center</Link></li>
              <li><Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">Contact Us</Link></li>
              <li><Link href="/status" className="text-base text-gray-500 hover:text-gray-900">Status</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li><Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">Privacy</Link></li>
              <li><Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">Terms</Link></li>
              <li><Link href="/cookies" className="text-base text-gray-500 hover:text-gray-900">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Twitter</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Facebook</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}`,
};

export const generateComponent = async (options: GenerateComponentOptions): Promise<any> => {
  const { componentType, style = 'modern' } = options;
    const componentName = componentType.charAt(0).toUpperCase() + componentType.slice(1);
    
    const component = {
      type: componentType,
      name: componentName,
      code: componentTemplates[componentType],
      description: `A responsive ${componentType} component built with React and Tailwind CSS. Features modern design principles and accessibility best practices.`,
      props: componentType === 'button' ? {
        variant: ['primary', 'secondary', 'outline', 'ghost'],
        size: ['sm', 'md', 'lg']
      } : componentType === 'card' ? {
        title: 'string',
        description: 'string',
        image: 'string (optional)',
        action: 'object (optional)'
      } : undefined,
    };

  return ComponentSchema.parse(component);
};
