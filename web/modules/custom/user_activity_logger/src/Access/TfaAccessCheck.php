<?php

namespace Drupal\user_activity_logger\Access;

use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;
use Symfony\Component\HttpFoundation\RequestStack;

class TfaAccessCheck {

  protected $requestStack;

  public function __construct(RequestStack $request_stack) {
    $this->requestStack = $request_stack;
  }

  public function access(AccountInterface $account) {
    // Must be logged in.
    if ($account->isAnonymous()) {
      return AccessResult::forbidden();
    }

    $session = $this->requestStack->getCurrentRequest()->getSession();
    $otp = $session->get('tfa_otp_' . $account->id());

    // If OTP exists in session, allow access.
    if (!empty($otp)) {
      return AccessResult::allowed();
    }

    // Otherwise, explicitly forbid access.
    return AccessResult::forbidden();
  }
}
