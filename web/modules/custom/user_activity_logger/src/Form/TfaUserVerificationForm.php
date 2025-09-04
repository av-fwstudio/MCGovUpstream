<?php

namespace Drupal\user_activity_logger\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\user\Entity\User;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;

class TfaUserVerificationForm extends FormBase {

  public function getFormId() {
    return 'tfa_user_verification_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['otp'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Enter OTP'),
      '#required' => TRUE,
    ];
    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Verify OTP'),
    ];
    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state) {
    $otp_entered = $form_state->getValue('otp');
    $store = \Drupal::service('tempstore.private')->get('user_activity_logger');
    $uid = $store->get('pending_tfa_uid');
    $stored_otp = $store->get('pending_tfa_otp');
    $stored_time = $store->get('pending_tfa_time');

    if (!$uid || !$stored_otp) {
      $form_state->setErrorByName('otp', $this->t('Session expired. Please log in again.'));
      return;
    }

    if ($otp_entered != $stored_otp || (\Drupal::time()->getCurrentTime() - $stored_time) > 300) {
      $form_state->setErrorByName('otp', $this->t('Invalid or expired OTP.'));
    }
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $store = \Drupal::service('tempstore.private')->get('user_activity_logger');
    $uid = $store->get('pending_tfa_uid');

    if ($uid) {
      $account = User::load($uid);
      if ($account) {
        // Finalize login only here!
        user_login_finalize($account);

        // Clean tempstore.
        $store->delete('pending_tfa_uid');
        $store->delete('pending_tfa_otp');
        $store->delete('pending_tfa_time');

        \Drupal::messenger()->addStatus($this->t('OTP verified! You are now logged in.'));

        $url = Url::fromRoute('entity.user.canonical', ['user' => $account->id()])->toString();
        $form_state->setResponse(new RedirectResponse($url));
        return;
      }
    }

    \Drupal::messenger()->addError($this->t('Something went wrong. Please log in again.'));
    $form_state->setRedirect('user.login');
  }

}
