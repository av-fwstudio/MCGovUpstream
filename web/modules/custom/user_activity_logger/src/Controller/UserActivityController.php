<?php

namespace Drupal\user_activity_logger\Controller;

use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Link;
use Drupal\Core\Database\Database;
use Drupal\Core\Render\Markup;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Pager\PagerManagerInterface;
use Drupal\Core\Pager\PagerParameters;
use Symfony\Component\HttpFoundation\Response;

class UserActivityController extends ControllerBase {

  public function display() {
    $limit = 20;
  
    $header = [
      'uid' => 'User ID',
      'username' => 'Username',
      'action' => 'Action',
      'entity_type' => 'Entity Type',
      'entity_id' => 'Entity ID',
      'entity_label' => 'Entity Name',
      'ip_address' => 'IP Address',
      'timestamp' => 'Timestamp',
    ];
  
    $query = Database::getConnection()->select('user_activity_log', 'ual')
      ->fields('ual')
      ->orderBy('timestamp', 'DESC');
  
    $query = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')
      ->limit($limit);
  
    $results = $query->execute()->fetchAll();
    $rows = [];
  
    foreach ($results as $record) {
      $entity_label = '';
      if (!empty($record->entity_type) && !empty($record->entity_id)) {
        $storage = \Drupal::entityTypeManager()->getStorage($record->entity_type);
        $entity = $storage->load($record->entity_id);
        if ($entity && $entity instanceof \Drupal\Core\Entity\EntityInterface && method_exists($entity, 'label')) {
          $entity_label = $entity->label();
        }
      }
  
      $rows[] = [
        'uid' => $record->uid,
        'username' => Link::fromTextAndUrl($record->username, Url::fromRoute('entity.user.canonical', ['user' => $record->uid]))->toString(),
        'action' => ucfirst($record->action),
        'entity_type' => $record->entity_type,
        'entity_id' => $record->entity_id,
        'entity_label' => $entity_label,
        'ip_address' => $record->ip_address,
        'timestamp' => \Drupal::service('date.formatter')->format($record->timestamp, 'short'),
      ];
    }
  
    return [
      'export_link' => [
        '#type' => 'link',
        '#title' => $this->t('Export to CSV'),
        '#url' => Url::fromRoute('user_activity_logger.export'),
        '#attributes' => ['class' => ['button', 'button--primary']],
      ],
      'table' => [
        '#type' => 'table',
        '#header' => $header,
        '#rows' => $rows,
        '#empty' => 'No activity logs found.',
      ],
      'pager' => [
        '#type' => 'pager',
      ],
    ];
  }
  

  public function export() {
    $header = [
      'User ID',
      'Username',
      'Action',
      'Entity Type',
      'Entity ID',
      'Entity Name',
      'IP Address',
      'Timestamp',
    ];
  
    $query = Database::getConnection()->select('user_activity_log', 'ual')
      ->fields('ual')
      ->orderBy('timestamp', 'DESC');
    $results = $query->execute()->fetchAll();
  
    $rows = [];
    foreach ($results as $record) {
      $entity_label = '';
      if (!empty($record->entity_type) && !empty($record->entity_id)) {
        $storage = \Drupal::entityTypeManager()->getStorage($record->entity_type);
        $entity = $storage->load($record->entity_id);
        if ($entity && $entity instanceof \Drupal\Core\Entity\EntityInterface && method_exists($entity, 'label')) {
          $entity_label = $entity->label();
        }
      }
  
      $rows[] = [
        $record->uid,
        $record->username,
        ucfirst($record->action),
        $record->entity_type,
        $record->entity_id,
        $entity_label,
        $record->ip_address,
        \Drupal::service('date.formatter')->format($record->timestamp, 'short'),
      ];
    }
  
    // Generate CSV output
    $filename = 'user_activity_log.csv';
    $content = fopen('php://temp', 'r+');
    fputcsv($content, $header);
    foreach ($rows as $row) {
      fputcsv($content, $row);
    }
    rewind($content);
    $csv = stream_get_contents($content);
    fclose($content);
  
    return new Response($csv, 200, [
      'Content-Type' => 'text/csv',
      'Content-Disposition' => 'attachment; filename="' . $filename . '"',
    ]);
  }

}