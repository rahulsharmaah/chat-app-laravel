
<?php

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class UserStatusChanged implements ShouldBroadcast
{
  public $user;

  public function __construct($user)
  {
    $this->user = $user;
  }

  public function broadcastOn()
  {
    return new Channel('users');
  }
}
