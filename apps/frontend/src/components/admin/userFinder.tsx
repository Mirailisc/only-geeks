import { useState, useEffect, useMemo } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@apollo/client/react';
import { SEARCH_USER_QUERY } from '@/graphql/admin';
import type { Profile } from '@/graphql/profile';
import { toast } from 'sonner';

interface UserSearchComboboxProps {
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}
type UserOption = Partial<Profile>;

export default function UserSearchCombobox({
  value,
  setValue,
  placeholder = "Search users..."
}: UserSearchComboboxProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use Apollo's useQuery with skip option
  const { data, loading } = useQuery<{ searchUser: UserOption[] }>(SEARCH_USER_QUERY, {
    variables: { query: debouncedQuery },
    skip: !debouncedQuery.trim(), // Skip query if search is empty
  });

  const users = useMemo(() => data?.searchUser || [], [data]);

  // Update selected user when value changes
  useEffect(() => {
    if (value && users.length > 0) {
      const user = users.find(u => u.id === value);
      if (user) setSelectedUser(user);
    } else if (!value) {
      setSelectedUser(null);
    }
  }, [value, users]);

  const handleSelect = (user: UserOption) => {
    if (!user.id) {
      toast.error('Invalid user selected.');
      return;
    }
    setValue(user.id);
    setSelectedUser(user);
    setOpen(false);
  };

  const getDisplayName = (user: UserOption) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''} (@${user.username || ''})`.trim();
    }
    return user.username || user.email;
  };

  const getInitials = (user: UserOption) => {
    if (user.firstName || user.lastName) {
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    return user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={selectedUser.picture} alt={getDisplayName(selectedUser)} />
                <AvatarFallback className="text-xs">{getInitials(selectedUser)}</AvatarFallback>
              </Avatar>
              <span className="truncate">{getDisplayName(selectedUser)}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Type to search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {
                // eslint-disable-next-line no-nested-ternary
                loading ? 'Searching...' : searchQuery ? 'No users found.' : 'Start typing to search'
              }
            </CommandEmpty>
            {users.length > 0 && (
              <CommandGroup>
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => handleSelect(user)}
                    className="cursor-pointer w-72"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${value === user.id ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.picture} alt={getDisplayName(user)} />
                      <AvatarFallback className="text-xs">{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{getDisplayName(user)}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email || user.username}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
