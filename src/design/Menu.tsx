import * as Dropdown from '@radix-ui/react-dropdown-menu';
import type { ReactNode } from 'react';

export function Menu({ trigger, children, align = 'start', preventReturnFocus = false }: { trigger: ReactNode; children: ReactNode; align?: 'start' | 'end'; preventReturnFocus?: boolean }) {
  return <Dropdown.Root modal={false}><Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger><Dropdown.Portal container={document.querySelector('.app')}><Dropdown.Content className="menu-surface" sideOffset={6} align={align} collisionPadding={8} onCloseAutoFocus={e => { if (preventReturnFocus) e.preventDefault(); }}>{children}</Dropdown.Content></Dropdown.Portal></Dropdown.Root>;
}
export function MenuItem({ children, onSelect, disabled }: { children: ReactNode; onSelect(): void; disabled?: boolean }) {
  return <Dropdown.Item className="menu-item" onSelect={onSelect} disabled={disabled}>{children}</Dropdown.Item>;
}
export const MenuSeparator = () => <Dropdown.Separator className="menu-separator" />;
