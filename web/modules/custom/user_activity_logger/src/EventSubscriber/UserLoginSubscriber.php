<?php

namespace Drupal\user_activity_logger\EventSubscriber;

use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Url;
use Drupal\user\Event\UserLoginEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class UserLoginSubscriber implements EventSubscriberInterface {

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    return [
      UserLoginEvent::class => 'onUserLogin',
    ];
  }

  /**
   * Handle user login event.
   */
  public function onUserLogin(UserLoginEvent $event) {
    $account = $event->getAccount();

    if ($account && $account->id()) {
      // Generate OTP.
      $otp = rand(100000, 999999);

      // Store OTP in session.
      $session = \Drupal::request()->getSession();
      $session->set('tfa_otp_' . $account->id(), $otp);

      // Send OTP via mail.
      \Drupal::service('plugin.manager.mail')->mail(
        'user_activity_logger',
        'send_otp',
        $account->getEmail(),
        $account->getPreferredLangcode(),
        ['otp' => $otp]
      );

      // Force redirect to verification page.
      $url = Url::fromRoute('user_activity_logger.tfa_verify')->toString();
      $response = new TrustedRedirectResponse($url);
      $response->send();
      exit; // Prevents normal login flow until OTP verified.
    }
  }
}
