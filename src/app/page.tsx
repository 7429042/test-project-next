'use client';
import {Avatar, Badge, Button} from '@heroui/react';

export default function Home() {
  return (
      <>
          <div className="p-4 space-y-2">
              <div className="bg-primary text-primary-foreground px-3 py-2 rounded">primary token</div>
              <div className="bg-content1 text-foreground px-3 py-2 rounded">content1 token</div>
          </div>
          <div className="flex items-center">
              <Badge color="primary" content="5" placement="top-right">
                  <Avatar radius="md" size="lg" src="https://i.pravatar.cc/300?u=a042581f4e29026709d" />
              </Badge>
          </div>

      </>

  );
}
